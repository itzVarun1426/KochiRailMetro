"use client";

import { useState, useEffect } from 'react';
import { trainService } from '@/lib/services/trainService';
import type { Train, DepotLayout } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Determine side index (1 = Muttom Yard, 2 = Muttom Depot)
function sideFromDepotLocation(depotLocation: string | undefined | null): 1 | 2 {
  if (!depotLocation) return 2;
  const value = depotLocation.trim().toLowerCase();
  if (value === 'muttom yard') return 1;
  if (value === 'muttom depot') return 2;
  // If depotLocation already a track id, infer side from its suffix (1/2)
  if (/\d$/.test(value)) {
    return value.endsWith('1') ? 1 : 2;
  }
  return 2;
}

// Resolve track id from a train's status and depot location
function getTrackIdForTrain(train: Train): string {
  // If backend already stores exact track id, prefer it
  const loc = (train.depotLocation || '').trim();
  if (loc === 'SL1' || loc === 'SL2' || loc === 'ML1' || loc === 'ML2' || loc === 'WK1' || loc === 'WK2' || loc === 'RN1' || loc === 'RN2') {
    return loc;
  }
  const side = sideFromDepotLocation(train.depotLocation);
  switch (train.status) {
    case 'MAINTENANCE':
      return side === 1 ? 'ML1' : 'ML2';
    case 'IN_SERVICE':
      return side === 1 ? 'RN1' : 'RN2';
    case 'ACTIVE':
    default:
      return side === 1 ? 'SL1' : 'SL2';
  }
}

// Map track type to status in our domain model
function statusForTrackType(trackType: 'Stabling' | 'Washing' | 'Maintenance' | 'Mainline'): Train['status'] {
  switch (trackType) {
    case 'Maintenance':
      return 'MAINTENANCE';
    case 'Mainline':
      return 'IN_SERVICE';
    case 'Stabling':
      return 'ACTIVE';
    case 'Washing':
    default:
      // No explicit WASHING status in Train; keep ACTIVE while located in washing line
      return 'ACTIVE';
  }
}

// Color/style mapping for Train status
function statusClasses(status: Train['status']): string {
  if (status === 'IN_SERVICE') return 'bg-green-200 text-green-900';
  if (status === 'MAINTENANCE') return 'bg-orange-200 text-orange-900';
  if (status === 'ACTIVE') return 'bg-blue-200 text-blue-900';
  if (status === 'RETIRED') return 'bg-gray-200 text-gray-900';
  return '';
}

export function DepotMap() {
  const [trains, setTrains] = useState<Train[]>([]);
  const [depotLayout, setDepotLayout] = useState<DepotLayout>({ tracks: [] });
  const [draggedTrainKey, setDraggedTrainKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrains = async () => {
      try {
        setLoading(true);
        const fetchedTrains = await trainService.getAllTrains();
        setTrains(fetchedTrains);

        const tracks = [
          // Stabling (only 2)
          { id: 'SL1', type: 'Stabling' as const, length: 150, trains: [] as string[] },
          { id: 'SL2', type: 'Stabling' as const, length: 150, trains: [] as string[] },
          // Maintenance (yard/depot)
          { id: 'ML1', type: 'Maintenance' as const, length: 120, trains: [] as string[] },
          { id: 'ML2', type: 'Maintenance' as const, length: 120, trains: [] as string[] },
          // Working lines (treated as Mainline type)
          { id: 'WK1', type: 'Mainline' as const, length: 140, trains: [] as string[] },
          { id: 'WK2', type: 'Mainline' as const, length: 140, trains: [] as string[] },
          // Running lines
          { id: 'RN1', type: 'Mainline' as const, length: 160, trains: [] as string[] },
          { id: 'RN2', type: 'Mainline' as const, length: 160, trains: [] as string[] },
        ];

        // Populate tracks using status + depotLocation mapping
        tracks.forEach(track => {
          track.trains = fetchedTrains
            .filter(train => getTrackIdForTrain(train) === track.id)
            .map(train => String(train.trainId));
        });

        setDepotLayout({ tracks });
      } catch (error) {
        console.error('Error fetching trains:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrains();
  }, []);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, trainKey: string) => {
    setDraggedTrainKey(trainKey);
    e.dataTransfer.effectAllowed = "move";
    // Some browsers require data to be set for drop to fire
    e.dataTransfer.setData('text/plain', trainKey);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  const handleDragEnd = () => {
    setDraggedTrainKey(null);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, targetTrackId: string) => {
    e.preventDefault();
    if (!draggedTrainKey) return;

    const trainToMove = trains.find(t => String(t.trainId) === draggedTrainKey);
    if (!trainToMove) return;

    // Recompute source track based on current status + depot location
    const sourceTrackId = getTrackIdForTrain(trainToMove);
    if (sourceTrackId === targetTrackId) {
      setDraggedTrainKey(null);
      return;
    }

    const targetTrack = depotLayout.tracks.find(t => t.id === targetTrackId);
    if (!targetTrack) return;

    const newStatus = (() => {
      if (targetTrack.id.startsWith('ML')) return 'MAINTENANCE' as Train['status'];
      if (targetTrack.id.startsWith('RN')) return 'IN_SERVICE' as Train['status'];
      if (targetTrack.id.startsWith('SL')) return 'ACTIVE' as Train['status'];
      if (targetTrack.id.startsWith('WK')) return 'ACTIVE' as Train['status'];
      return statusForTrackType(targetTrack.type);
    })();
    // Persist exact track id as depotLocation to match backend expectations
    const newDepotLocation = targetTrackId;

    try {
      // Persist depotLocation and status
      await trainService.updateTrain(String(trainToMove.trainId), {
        depotLocation: newDepotLocation,
        status: newStatus,
      } as Partial<Train>);

      // Update trains state
      setTrains(prev => prev.map(t =>
        t.trainId === trainToMove.trainId
          ? { ...t, depotLocation: newDepotLocation, status: newStatus }
          : t
      ));

      // Update depot layout
      setDepotLayout(prevLayout => {
        const newTracks = prevLayout.tracks.map(track => {
          if (track.id === sourceTrackId) {
            return { ...track, trains: track.trains.filter(id => id !== draggedTrainKey) };
          }
          if (track.id === targetTrackId) {
            return { ...track, trains: [...track.trains, draggedTrainKey] };
          }
          return track;
        });
        return { ...prevLayout, tracks: newTracks };
      });
    } catch (error) {
      console.error('Error updating train:', error);
    }

    setDraggedTrainKey(null);
  };

  const getTrainByKey = (key: string) => trains.find(t => String(t.trainId) === key);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading depot data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          {depotLayout.tracks.map(track => (
            <div
              key={track.id}
              className="flex items-center gap-4"
            >
              <div className="w-32 text-right">
                <p className="font-bold">{track.id}</p>
                <p className="text-xs text-muted-foreground">{track.type}</p>
              </div>
              <div
                className="flex-1 bg-muted rounded-lg h-24 p-2 border-2 border-dashed border-gray-300 flex flex-wrap items-start gap-2 overflow-x-auto"
                onDragOver={handleDragOver}
                onDragEnter={handleDragOver}
                onDrop={(e) => handleDrop(e, track.id)}
              >
                {track.trains.map(trainKey => {
                  const train = getTrainByKey(trainKey);
                  if (!train) return null;
                  return (
                    <div
                      key={trainKey}
                      draggable
                      onDragStart={(e) => handleDragStart(e, trainKey)}
                      onDragEnd={() => setDraggedTrainKey(null)}
                      className={cn(
                        "p-2 rounded-md h-16 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing w-28 shadow-md shrink-0",
                        statusClasses(train.status),
                        draggedTrainKey === trainKey && 'opacity-50'
                      )}
                    >
                      <span className="font-bold text-sm">{train.trainNumber}</span>
                      <span className="text-xs">{train.status}</span>
                    </div>
                  );
                })}
                {track.trains.length === 0 && (
                  <div className="text-sm text-muted-foreground text-center w-full self-center">Empty Track</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

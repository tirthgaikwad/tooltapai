import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { WorkflowStackBuilder } from './WorkflowStackBuilder';
import { useApp } from '@/contexts/AppContext';

export function PipelinePlannerModal() {
  const { pipelinePlannerOpen, setPipelinePlannerOpen } = useApp();

  return (
    <Dialog open={pipelinePlannerOpen} onOpenChange={setPipelinePlannerOpen}>
      <DialogContent className="max-w-4xl p-6 bg-[#141417] border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.8)] rounded-2xl text-white max-h-[90vh] overflow-y-auto">
        <WorkflowStackBuilder />
      </DialogContent>
    </Dialog>
  );
}

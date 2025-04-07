
import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Clock, File, Link, Plus } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Resource } from '@/types';

interface ResourceItemProps {
  resource: Resource;
}

const ResourceItem: React.FC<ResourceItemProps> = ({ resource }) => {
  const { openResource } = useApp();

  const getIcon = () => {
    switch (resource.type) {
      case 'pdf':
        return <File size={16} />;
      case 'link':
        return <Link size={16} />;
      case 'note':
        return <Calendar size={16} />;
      default:
        return <File size={16} />;
    }
  };

  return (
    <div 
      className="flex cursor-pointer items-center justify-between rounded-md border border-border p-3 hover:border-primary hover:bg-accent/50"
      onClick={() => openResource(resource)}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-secondary text-primary">
          {getIcon()}
        </div>
        <div>
          <h4 className="font-medium">{resource.name}</h4>
          <p className="text-xs text-muted-foreground">{resource.type.toUpperCase()}</p>
        </div>
      </div>
      <div className="flex items-center text-xs text-muted-foreground">
        <Clock size={12} className="mr-1" />
        {formatDate(resource.createdAt)}
      </div>
    </div>
  );
};

const ResourceList: React.FC = () => {
  const { activeSubject, addResource } = useApp();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newResourceName, setNewResourceName] = useState('');
  const [newResourceType, setNewResourceType] = useState<'pdf' | 'link' | 'note' | 'other'>('pdf');
  const [newResourcePath, setNewResourcePath] = useState('');
  const [newResourceUrl, setNewResourceUrl] = useState('');
  const [newResourceContent, setNewResourceContent] = useState('');

  if (!activeSubject) return null;
  
  const resources = activeSubject.resources;

  const handleAddResource = () => {
    if (newResourceName.trim() && activeSubject) {
      const resource = {
        name: newResourceName,
        type: newResourceType,
        subjectId: activeSubject.id,
      } as Omit<Resource, 'id' | 'createdAt'>;

      if (newResourceType === 'pdf' && newResourcePath) {
        resource.path = newResourcePath;
      }

      if (newResourceType === 'link' && newResourceUrl) {
        resource.url = newResourceUrl;
      }

      if (newResourceType === 'note' && newResourceContent) {
        resource.content = newResourceContent;
      }

      addResource(resource);
      setNewResourceName('');
      setNewResourcePath('');
      setNewResourceUrl('');
      setNewResourceContent('');
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="mt-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Resources</h3>
        <Button size="sm" onClick={() => setIsDialogOpen(true)}>
          <Plus size={16} className="mr-1" />
          Add Resource
        </Button>
      </div>

      {resources.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-8 text-center">
          <File size={32} className="mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No resources added yet</p>
          <Button variant="link" onClick={() => setIsDialogOpen(true)}>
            Add your first resource
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {resources.map((resource) => (
            <ResourceItem key={resource.id} resource={resource} />
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Resource</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="resource-name" className="text-sm font-medium">
                Resource Name
              </label>
              <Input
                id="resource-name"
                placeholder="e.g., Lecture Notes Week 1"
                value={newResourceName}
                onChange={(e) => setNewResourceName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="resource-type" className="text-sm font-medium">
                Resource Type
              </label>
              <Select
                value={newResourceType}
                onValueChange={(value) => setNewResourceType(value as any)}
              >
                <SelectTrigger id="resource-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Document</SelectItem>
                  <SelectItem value="link">Web Link</SelectItem>
                  <SelectItem value="note">Note</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {newResourceType === 'pdf' && (
              <div className="space-y-2">
                <label htmlFor="resource-path" className="text-sm font-medium">
                  File Path
                </label>
                <Input
                  id="resource-path"
                  placeholder="e.g., C:/Documents/lecture1.pdf"
                  value={newResourcePath}
                  onChange={(e) => setNewResourcePath(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Enter the full path to your PDF file on your computer
                </p>
              </div>
            )}

            {newResourceType === 'link' && (
              <div className="space-y-2">
                <label htmlFor="resource-url" className="text-sm font-medium">
                  URL
                </label>
                <Input
                  id="resource-url"
                  placeholder="e.g., https://example.com/resource"
                  value={newResourceUrl}
                  onChange={(e) => setNewResourceUrl(e.target.value)}
                />
              </div>
            )}

            {newResourceType === 'note' && (
              <div className="space-y-2">
                <label htmlFor="resource-content" className="text-sm font-medium">
                  Note Content
                </label>
                <textarea
                  id="resource-content"
                  className="h-24 w-full rounded-md border border-input px-3 py-2"
                  placeholder="Enter your note here..."
                  value={newResourceContent}
                  onChange={(e) => setNewResourceContent(e.target.value)}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddResource}>Add Resource</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResourceList;

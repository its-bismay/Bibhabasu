import { FileSystemNode, FileType } from '../types';
import { fileSystem } from '../constants';

export const findNodeById = (nodes: FileSystemNode[], id: string): FileSystemNode | null => {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
};

export const getPathToNode = (nodes: FileSystemNode[], targetId: string, currentPath: FileSystemNode[] = []): FileSystemNode[] | null => {
  for (const node of nodes) {
    if (node.id === targetId) {
      return [...currentPath, node];
    }
    if (node.children) {
      const foundPath = getPathToNode(node.children, targetId, [...currentPath, node]);
      if (foundPath) return foundPath;
    }
  }
  return null;
};

export const formatPath = (path: FileSystemNode[]): string => {
  // Convert [Root, C:, Users, Visitor] to "C:/Users/Visitor"
  if (path.length <= 1) return '/';
  // Skip Root
  return path.slice(1).map(p => p.name.replace(':', '')).join('/');
};

export const resolvePathFromId = (currentId: string, pathStr: string): string | null => {
    // Simple resolution logic for the terminal
    // Supports: ".." (parent), or direct child name
    
    // Find current node context
    const allNodes = fileSystem; // Start search from root const
    const currentNode = findNodeById(allNodes, currentId);
    
    if (!currentNode) return null;

    if (pathStr === '..') {
       // Find parent
       const pathTrace = getPathToNode(allNodes, currentId);
       if(pathTrace && pathTrace.length > 1) {
         // Return the ID of the second to last item (parent)
         return pathTrace[pathTrace.length - 2].id;
       }
       return currentId; // Already at root/top
    }

    // Check children
    const child = currentNode.children?.find(c => c.name.toLowerCase() === pathStr.toLowerCase() || c.name.toLowerCase().replace(':', '') === pathStr.toLowerCase());
    if (child) return child.id;

    return null;
};

export const findAllFilesByType = (nodes: FileSystemNode[], type: FileType): FileSystemNode[] => {
    let results: FileSystemNode[] = [];
    for (const node of nodes) {
        if (node.type === type) {
            results.push(node);
        }
        if (node.children) {
            results = results.concat(findAllFilesByType(node.children, type));
        }
    }
    return results;
};
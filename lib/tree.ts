import type { TreeNode, Branch } from "./types";

export function countNodes(node: TreeNode): number {
  if (!node.children.length) return 1;
  return 1 + node.children.reduce((sum, b) => sum + countNodes(b.node), 0);
}

export function findNode(root: TreeNode, id: string): TreeNode | null {
  if (root.id === id) return root;
  for (const branch of root.children) {
    const found = findNode(branch.node, id);
    if (found) return found;
  }
  return null;
}

export function updateNode(root: TreeNode, id: string, patch: Partial<TreeNode>): TreeNode {
  if (root.id === id) return { ...root, ...patch };
  return {
    ...root,
    children: root.children.map((b) => ({
      ...b,
      node: updateNode(b.node, id, patch),
    })),
  };
}

export function deleteNode(root: TreeNode, id: string): TreeNode {
  return {
    ...root,
    children: root.children
      .filter((b) => b.node.id !== id)
      .map((b) => ({ ...b, node: deleteNode(b.node, id) })),
  };
}

export function addChild(root: TreeNode, parentId: string, branch: Branch): TreeNode {
  if (root.id === parentId) {
    return { ...root, children: [...root.children, branch] };
  }
  return {
    ...root,
    children: root.children.map((b) => ({
      ...b,
      node: addChild(b.node, parentId, branch),
    })),
  };
}

export function getPathToNode(root: TreeNode, targetId: string): TreeNode[] {
  if (root.id === targetId) return [root];
  for (const branch of root.children) {
    const path = getPathToNode(branch.node, targetId);
    if (path.length) return [root, ...path];
  }
  return [];
}

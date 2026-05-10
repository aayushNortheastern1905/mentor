export type NodeType = "question" | "check" | "conclusion";

export type TreeNode = {
  id: string;
  type: NodeType;
  text: string;
  why?: string;
  children: Branch[];
};

export type Branch = {
  label: string;
  node: TreeNode;
};

export type Domain = "diesel" | "inspection";

export type SavedTree = {
  id: string;
  domain: Domain;
  title: string;
  rootText: string;
  root: TreeNode;
  createdAt: string;
};

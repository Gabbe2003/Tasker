export interface Task {
    name: string;
    subTask: string;
    priority: 'low' | 'medium' | 'high';
    status: "completed" | "in progress" | "pending";
    dueDate: Date;
  }
  
  export interface Folder {
    name: string;
    favorite?: boolean;
    tasks: Task[];
  }

  export type IAlertProps = {
    message: string;
    type: string;
    dismissAlert: () => void;
  };

  
  export interface State {
    name: string;
    editTask: Task[];
    tasks: Task[];
    folders: Folder[];
    subTask: string;
    selectedFolder: Folder | null;
    editingFolder: Folder | null;
    folderName: string;
    taskName: string;
    taskPriority: 'low' | 'medium' | 'high';
    taskStatus: "completed" | "in progress" | "pending";
    taskDueDate: string;
    search: string;
    selectedTask: Task | string | null;
  }
  
  export const initialState: State = {
  name:'',
  editTask: [],
  tasks: [],
  folders: [],
  subTask: '',
  selectedFolder: null,
  editingFolder: null,
  folderName: '',
  taskName: '',
  taskPriority: 'low',
  taskStatus: "pending",
  taskDueDate: '',
  search: '',
  selectedTask: '',
  }
  
  
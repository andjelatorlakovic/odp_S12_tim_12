// types/kviz/Kviz.ts
export interface Kviz {
  id: number;
  naziv_kviza: string;
  jezik: string;
  nivo_znanja: string;
}

// types/kviz/ApiResponseKviz.ts
export interface ApiResponseKviz {
  success: boolean;
  message: string;
  data: Kviz | null;
}

export interface ApiResponseKvizList {
  success: boolean;
  message: string;
  data: Kviz[];
}

export interface ApiResponseDelete {
  success: boolean;
  message: string;
}

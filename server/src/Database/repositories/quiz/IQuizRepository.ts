import { Kviz } from "../../../Domain/models/Quiz";

export interface IKvizRepository {
  getAllKvizovi(): Promise<Kviz[]>;
  createKviz(kviz: Kviz): Promise<Kviz>;
  getById(id: number): Promise<Kviz | null>;
  getByNazivJezikNivo(naziv_kviza: string, jezik: string, nivo_znanja: string): Promise<Kviz | null>;
  deleteById(id: number): Promise<boolean>;
  getByJezikINivo(jezik: string, nivo_znanja: string): Promise<Kviz[]>;
}

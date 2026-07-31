import type { CreateServerInput, Server } from "../models/server";

export interface ServerRepository {
  getAll(): Promise<Server[]>;
  getById(id: number): Promise<Server>;
  create(data: CreateServerInput): Promise<Server>;
  update(id: number, data: CreateServerInput): Promise<Server>;
  delete(id: number): Promise<void>;
  getInviteCode(id: number): Promise<string>;
  joinByInviteCode(code: string): Promise<Server>;
}

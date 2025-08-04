import Dexie from "dexie";

export const db = new Dexie("MyDatabase");

db.version(1).stores({
  experiments: "++id,experiment_id,metric_name,step,value"
});

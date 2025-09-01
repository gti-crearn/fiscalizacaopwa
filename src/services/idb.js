// src/utils/idb.js
import { openDB } from "idb";

const DB_NAME = "fiscalizacao-db";
const DB_VERSION = 6; // Incrementado

async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("users")) {
        db.createObjectStore("users", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("targets")) {
        db.createObjectStore("targets", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("teams")) {
        db.createObjectStore("teams", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("teams_detalhados")) {
        db.createObjectStore("teams_detalhados", { keyPath: "id" });
      }

      // ✅ Novo: store para fiscalizações offline
      if (!db.objectStoreNames.contains("fiscalizacoes")) {
        const store = db.createObjectStore("fiscalizacoes", { keyPath: "targetId" });
        store.createIndex("pendingSync", "pendingSync"); // Para sincronizar depois
      }
    },
  });
}

// --- Funções existentes (mantidas) ---
export async function salvarUserData(users) {
  const arr = Array.isArray(users) ? users : [users];
  const db = await getDB();
  const tx = db.transaction("users", "readwrite");
  const store = tx.objectStore("users");
  for (const u of arr) await store.put(u);
  await tx.done;
}

export async function salvarTeamData(teams) {
  const arr = Array.isArray(teams) ? teams : [teams];
  const db = await getDB();
  const tx = db.transaction("teams", "readwrite");
  const store = tx.objectStore("teams");
  for (const u of arr) await store.put(u);
  await tx.done;
}

export async function carregarTodosTeams() {
  const db = await getDB();
  return db.getAll("teams");
}

export async function carregarTodosUsers() {
  const db = await getDB();
  return db.getAll("users");
}

export async function salvarTargets(targets) {
  const arr = Array.isArray(targets) ? targets : [targets];
  const db = await getDB();
  const tx = db.transaction("targets", "readwrite");
  const store = tx.objectStore("targets");
  for (const t of arr) await store.put(t);
  await tx.done;
}

export async function carregarTodosTargets() {
  const db = await getDB();
  return db.getAll("targets");
}

export async function limparTargets() {
  const db = await getDB();
  const tx = db.transaction("targets", "readwrite");
  await tx.objectStore("targets").clear();
  await tx.done;
}

export async function salvarTeamDetalhado(team) {
  if (!team || !team.id) return;
  const db = await getDB();
  const tx = db.transaction("teams_detalhados", "readwrite");
  await tx.objectStore("teams_detalhados").put(team);
}

export async function carregarTeamDetalhado(teamId) {
  const db = await getDB();
  return db.get("teams_detalhados", Number(teamId));
}

export async function limparTeamDetalhado() {
  const db = await getDB();
  const tx = db.transaction("teams_detalhados", "readwrite");
  await tx.objectStore("teams_detalhados").clear();
  await tx.done;
}

// utils/idb.js
export async function salvarFiscalizacaoOffline(data) {
  const db = await getDB();

  // ✅ Processar as fotos ANTES da transação
  const fotosBlobs = [];
  for (const file of data.photos) {
    const arrayBuffer = await file.arrayBuffer();
    fotosBlobs.push({
      name: file.name,
      type: file.type,
      data: arrayBuffer,
    });
  }

  const registro = {
    targetId: data.targetId,
    status: data.status,
    fotos: fotosBlobs,
    timestamp: Date.now(),
    pendingSync: true,
  };

  // ✅ Abre a transação e faz o put imediatamente
  const tx = db.transaction("fiscalizacoes", "readwrite");
  const store = tx.objectStore("fiscalizacoes");

  // ✅ put() DENTRO da transação ativa
  store.put(registro);

  // ✅ Aguarda a transação terminar
  await tx.done;

  console.log("✅ Fiscalização salva offline:", registro);
}

export async function carregarFiscalizacoesOffline() {
  const db = await getDB();
  return db.getAll("fiscalizacoes");
}

export async function removerFiscalizacaoOffline(targetId) {
  const db = await getDB();
  const tx = db.transaction("fiscalizacoes", "readwrite");
  await tx.objectStore("fiscalizacoes").delete(targetId);
  await tx.done;
}
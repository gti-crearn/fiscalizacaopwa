// src/utils/idb.js
import { openDB } from "idb";

const DB_NAME = "fiscalizacao-db";
const DB_VERSION = 7; // Incrementado

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
      if (!db.objectStoreNames.contains("fiscalizacoes")) {
        const store = db.createObjectStore("fiscalizacoes", { keyPath: "targetId" });
        store.createIndex("pendingSync", "pendingSync");
      }

      // ✅ NOVO: Store para modelos de checklist (serviços)
      if (!db.objectStoreNames.contains("servicos")) {
        db.createObjectStore("servicos", { keyPath: "id" });
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
  // ✅ Inclui TUDO necessário para sincronizar depois
  const registro = {
    targetId: data.targetId,
    status: data.status,
    observacao: data.observacao || "",
    userId: data.userId,
    checklist: data.checklist || [], // ✅ checklist incluso
    fotos: fotosBlobs,
    timestamp: Date.now(),
    pendingSync: true,
  };

  const tx = db.transaction("fiscalizacoes", "readwrite");
  const store = tx.objectStore("fiscalizacoes");

  store.put(registro);

  await tx.done;

  console.log("✅ Fiscalização salva offline com checklist:", registro);
}

export async function carregarFiscalizacoesOffline() {
  const db = await getDB();
  const todos = await db.getAll("fiscalizacoes");
  console.log("📥 Dados carregados do IndexedDB:", todos); // debug
  return todos;
}

export async function removerFiscalizacaoOffline(targetId) {
  const db = await getDB();
  const tx = db.transaction("fiscalizacoes", "readwrite");
  await tx.objectStore("fiscalizacoes").delete(targetId);
  await tx.done;
}

// --- NOVAS FUNÇÕES: Serviços (checklist-modelo) ---
export async function salvarServicos(servicos) {
  const db = await getDB();
  const tx = db.transaction("servicos", "readwrite");
  const store = tx.objectStore("servicos");

  // 🔁 Extrai todos os serviços, independentemente da estrutura
  const items = Array.isArray(servicos)
    ? servicos
    : Object.values(servicos).flat();

  console.log("🔧 Itens a salvar no IndexedDB:", items);

  for (const s of items) {
    if (!s) {
      console.warn("❌ Item nulo/undefined ignorado");
      continue;
    }

    if (!s.id) {
      console.error("❌ Falha: serviço sem id:", s);
      continue;
    }

    // ✅ Garante que o id é um valor válido (não string vazia, null, etc)
    if (!s.id || s.id === "" || s.id === null || s.id === undefined) {
      console.error("❌ ID inválido encontrado:", s);
      continue;
    }

    try {
      await store.put(s);
      console.log("✅ Salvo:", s.id, s.servico);
    } catch (putErr) {
      console.error("❌ Erro ao salvar no IndexedDB:", putErr, s);
    }
  }

  await tx.done;
  console.log("✅ Todos os serviços salvos com sucesso.");
}

export async function carregarTodosServicos() {
  const db = await getDB();
  const todos = await db.getAll("servicos"); // Isso retorna um array

  // Agrupa por modalidade, garantindo que cada valor seja um array
  const agrupado = todos.reduce((acc, s) => {
    const modalidade = s.modalidade;

    if (!modalidade) {
      console.warn("⚠️ Serviço sem modalidade:", s);
      return acc;
    }

    if (!acc[modalidade]) {
      acc[modalidade] = []; // inicializa como array
    }

    acc[modalidade].push(s); // adiciona o serviço
    return acc;
  }, {});

  // ✅ Garante que o retorno é sempre um objeto com arrays
  return agrupado;
}

export async function limparServicos() {
  const db = await getDB();
  const tx = db.transaction("servicos", "readwrite");
  await tx.objectStore("servicos").clear();
  await tx.done;
}

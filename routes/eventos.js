const express = require("express");
const router = express.Router();
const db = require("../db.js");

// Listar todos os eventos
router.get("/", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM Evento");
  res.json(rows);
});

// Criar evento
router.post("/", async (req, res) => {
  try {
    // Recebe os dados (Note que aqui usamos nomes genéricos vindos do front)
    const { titulo, data_evento, hora_evento, local, vagas, valor, id_organizador } = req.body; 
    
    if (!id_organizador) {
        return res.status(400).json({ error: "Usuário não logado." });
    }

    // A QUERY DEVE USAR EXATAMENTE OS NOMES DA SUA IMAGEM DO BANCO
    await db.query(
      `INSERT INTO Evento (titulo, data_evento, hora_evento, local, vagas, valor, id_organizador) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`, 
      [titulo, data_evento, hora_evento, local, vagas, valor, id_organizador]
    );
    
    res.status(201).json({ message: "Evento criado com sucesso!" });
  } catch (error) {
    console.error("Erro ao criar evento:", error);
    res.status(500).json({ error: "Erro ao criar evento no banco." });
  }
});

//atualizar evento
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // 1. ADICIONEI 'vagas' e 'valor' AQUI NA LEITURA
    const { titulo, descricao, data_evento, hora_evento, local, vagas, valor } = req.body; 
    
    // 2. ADICIONEI OS CAMPOS NO COMANDO SQL
    await db.query(
      "UPDATE Evento SET titulo = ?, descricao = ?, data_evento = ?, hora_evento = ?, local = ?, vagas = ?, valor = ? WHERE id_evento = ?",
      [titulo, descricao, data_evento, hora_evento, local, vagas, valor, id]
    );
    
    res.status(200).json({ message: "Evento atualizado com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar evento:", error);
    res.status(500).json({ error: "Erro ao atualizar evento. Verifique os dados." });
  }
});

// deletar evento
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Primeiro, deletar todas as inscrições relacionadas a este evento
    await db.query("DELETE FROM inscricao WHERE id_evento = ?", [id]);

    // Depois, deletar o evento
    await db.query("DELETE FROM evento WHERE id_evento = ?", [id]);

    res.status(200).json({ message: "Evento e inscrições relacionados deletados com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar evento:", error);
    res.status(500).json({ error: "Erro ao deletar evento." });
  }
});

module.exports = router;
















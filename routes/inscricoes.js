const express = require("express");
const router = express.Router();
const db = require("../db.js");

// Listar todas as inscrições
router.get("/", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM Inscricao");
  res.json(rows);
});

// Inscrever usuário em um evento
router.post("/", async (req, res) => {
  try {
    const { id_usuario, id_evento } = req.body;
    await db.query("INSERT INTO inscricao (id_usuario, id_evento) VALUES (?, ?)", [id_usuario, id_evento]);
    res.status(201).json({ message: "Inscrição realizada com sucesso!" });
  } catch (error) {
    console.error("Erro ao realizar inscrição:", error);
    res.status(500).json({ error: "Erro ao realizar inscrição. Verifique os IDs de usuário e evento." });
  }
});

// Rota para atualizar o status de uma inscrição
router.put("/:id_evento/:id_usuario", async (req, res) => {
  try {
    const { id_evento, id_usuario } = req.params;
    const { data_inscricao, status } = req.body; // Pega os novos dados do corpo da requisição

    // A query UPDATE define os campos a serem atualizados
    await db.query(
      "UPDATE inscricao SET data_inscricao = ?, status = ? WHERE id_evento = ? AND id_usuario = ?",
      [data_inscricao, status, id_evento, id_usuario]
    );

    res.status(200).json({ message: "Inscrição atualizada com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar inscrição:", error);
    res.status(500).json({ error: "Erro ao atualizar inscrição." });
  }
});

// Rota para deletar uma inscrição
router.delete("/:id_evento/:id_usuario", async (req, res) => {
  try {
    const { id_evento, id_usuario } = req.params; 
    await db.query(
      "DELETE FROM inscricao WHERE id_evento = ? AND id_usuario = ?", 
      [id_evento, id_usuario]
    );
    res.status(200).json({ message: "Inscrição cancelada com sucesso!" });
  } catch (error) {
    console.error("Erro ao cancelar inscrição:", error);
    res.status(500).json({ error: "Erro ao cancelar inscrição." });
  }
});

module.exports = router;


const express = require("express");
const router = express.Router();
const db = require("../db.js");

// Listar todos os usuários
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Usuario");
    res.json(rows);
  } catch (err) {
    console.error("Erro ao listar:", err);
    res.status(500).json({ error: "Erro ao listar usuários" });
  }
});

// Rota para PEGAR um perfil específico (usado no Modal)
// IMPORTANTE: Essa rota deve vir antes ou depois, mas não pode duplicar
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT nome, email FROM Usuario WHERE id_usuario = ?", [req.params.id]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ error: "Usuário não encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar perfil" });
  }
});

// Criar usuário (Cadastro)
router.post("/", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    console.log("Dados recebidos:", req.body);

    await db.query(
      "INSERT INTO Usuario (nome, email, senha) VALUES (?, ?, ?)",
      [nome, email, senha]
    );

    res.status(201).json({ message: "Usuário criado com sucesso!" });
  } catch (err) {
    console.error("Erro ao criar:", err);
    res.status(500).json({ error: "Erro ao criar o usuário." });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, senha } = req.body;
  try {
    const [rows] = await db.query("SELECT * FROM Usuario WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.status(401).json({ error: "Email ou senha incorretos." });
    }

    const usuario = rows[0];

    if (usuario.senha !== senha) {
      return res.status(401).json({ error: "Email ou senha incorretos." });
    }

    res.status(200).json({
      message: "Login realizado com sucesso!",
      usuario: { id_usuario: usuario.id_usuario, nome: usuario.nome }
    });

  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

// ATUALIZAR Perfil (PUT) - Esta é a ÚNICA rota PUT agora
router.put("/:id", async (req, res) => {
  const { nome, email, senhaConfirmacao } = req.body;
  const idUsuario = req.params.id;

  try {
    // 1. Busca a senha atual no banco para conferir
    const [user] = await db.query("SELECT senha FROM Usuario WHERE id_usuario = ?", [idUsuario]);
    
    if (user.length === 0) {
        return res.status(404).json({ error: "Usuário não encontrado." });
    }

    // 2. Compara a senha digitada com a do banco
    if (user[0].senha !== senhaConfirmacao) {
        return res.status(401).json({ error: "Senha incorreta! Alteração negada." });
    }

    // 3. Se a senha estiver certa, atualiza o nome e email
    await db.query("UPDATE Usuario SET nome = ?, email = ? WHERE id_usuario = ?", [nome, email, idUsuario]);
    
    res.status(200).json({ message: "Perfil atualizado com sucesso!" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro no servidor." });
  }
});

// Deletar usuário (Se você for implementar no futuro, coloque o código aqui)
// router.delete("/:id", async (req, res) => { ... });

module.exports = router;
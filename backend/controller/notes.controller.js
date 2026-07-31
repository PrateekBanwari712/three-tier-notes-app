import { prisma } from "../lib/prisma.js";

export const addNote = async (req, res) => {
  try {
    const { content, userId } = req.body;

    if (!content?.trim() || !userId) {
      return res.status(400).json({ message: "Note content and user ID are required", success: false });
    }

    const user = await prisma.user.findUnique({ where: { id: Number(userId) } });

    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    const note = await prisma.note.create({
      data: {
        content: content.trim(),
        userId: user.id,
      },
    });

    return res.status(201).json({ message: "Note created", success: true, note });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Unable to create note", success: false, err: error.message });
  }
};

export const getnotes = async (req, res) => {
  try {
    const userId = Number(req.query.userId);

    if (!userId) {
      return res.status(400).json({ message: "A user ID is required", success: false });
    }

    const notes = await prisma.note.findMany({
      where: { userId },
      orderBy: { id: "desc" },
      select: {
        id: true,
        content: true,
      },
    });

    return res.status(200).json({ notes, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Unable to fetch notes", success: false, err: error.message });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const noteId = Number(req.params.id);

    if (!noteId) {
      return res.status(400).json({ message: "A note ID is required", success: false });
    }

    await prisma.note.delete({ where: { id: noteId } });

    return res.status(200).json({ message: "Note deleted", success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Unable to delete note", success: false, err: error.message });
  }
};

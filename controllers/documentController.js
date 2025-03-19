const Document = require("../models/documentModel");
const Y = require("yjs");
const User = require("../models/userModel");

//Create doc
exports.createDocument = async (req, res) => {
  try {
    const { owner } = req.body; // Get owner from request

    const newDoc = new Document({ owner }); // Assign owner
    await newDoc.save();

    res.status(201).json({ _id: newDoc._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDocumentTitle = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Document.findById(id);
    if (!doc) return res.status(404).json({ error: "Document not found" });

    res.status(200).json({ title: doc.title });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getdocSharedUsers = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Document.findById(id);
    if (!doc) return res.status(404).json({ error: "Document not found" });
     
    res.status(200).json({ collaborators: doc.collaborators });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateDocumentTitle = async (req, res) => {
  console.log("inside updateDocumentTitle");

  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title.trim()) {
      return res.status(400).json({ error: "Title cannot be empty" });
    }

    const updatedDoc = await Document.findByIdAndUpdate(
      id,
      { title },
      { new: true }
    );

    if (!updatedDoc) {
      return res.status(404).json({ error: "Document not found" });
    }

    res.status(200).json({ message: "Title updated", title: updatedDoc.title });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a user to the shared list
exports.addCollaborator = async (req, res) => {
  try {
    const { docId, userEmail } = req.body;

    // Find the user by email
    const user = await User.findOne({ email: userEmail });
    console.log("inside addCollab");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Add user to collaborators
    const updatedDoc = await Document.findByIdAndUpdate(
      docId,
      { $addToSet: { collaborators: user._id } }, // Prevents duplicate entries
      { new: true }
    );

    if (!updatedDoc) {
      return res.status(404).json({ error: "Document not found" });
    }

    res
      .status(200)
      .json({ message: "Collaborator added", document: updatedDoc });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove a user from the shared list
exports.removeSharedUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { userEmail } = req.body;

    const user = await User.findOne({ email: userEmail });
    if (!user) return res.status(404).json({ error: "User not found" });

    const updatedDoc = await Document.findByIdAndUpdate(
      id,
      { $pull: { collaborators: user._id } },
      { new: true }
    );

    if (!updatedDoc) return res.status(404).json({ error: "Document not found" });

    res.status(200).json({
      message: "User removed successfully",
      collaborators: updatedDoc.collaborators,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all documents where the user is the creator or a collaborator
exports.getUserDocuments = async (req, res) => {
  console.log("getDoc called");
  
  try {
    const { userId } = req.params;

    const documents = await Document.find({
      $or: [{ owner: userId }, { collaborators: userId }],
    }).sort({ updatedAt: -1 }); // Sort by last updated

    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// save doc
exports.saveDocument = async (req, res) => {
  try {
    console.log("inside saveDocument");
    const { content } = req.body;
    const document = await Document.findById(req.params.docId);
    if (!document) return res.status(404).json({ error: "Document not found" });

    const ydoc = new Y.Doc();
    if (document.content && document.content.length > 0) {
      Y.applyUpdate(ydoc, new Uint8Array(document.content));
    }

    if (content && content.length > 0) {
      Y.applyUpdate(ydoc, new Uint8Array(content));
    }

    document.content = Buffer.from(Y.encodeStateAsUpdate(ydoc));
    await document.save();

    res.json({ message: "Document saved" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// load doc
exports.loadDocument = async (req, res) => {
  console.log("inside loadDoc");
  
  try {
    const doc = await Document.findOne({ _id: req.params.docId });
      console.log(doc);
      
    if (doc) {
      // Convert stored Buffer back to Y.js Doc
      const ydoc = new Y.Doc();
      if (doc.content) {
        Y.applyUpdate(ydoc, new Uint8Array(doc.content));
      }
      

      res.status(200).json({
        _id: doc._id,
        title: doc.title,
        owner: doc.owner,
        collaborators: doc.collaborators,
        content: Array.from(Y.encodeStateAsUpdate(ydoc)),
      });
    } else {
      res.status(404).json({ message: "Document not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  console.log("loadDoc");
};

// remove doc
exports.removeDocController = async (req, res) => {

  console.log("removeDocController");
  const id = req.params.id
  try {
      const deleteDoc = await Document.findByIdAndDelete({ _id: id })
      res.status(200).json(deleteDoc)

  } catch (err) {
      res.status(401).json(err)
  }

}

import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";
import { query, where, getDocs } from "firebase/firestore";
import { doc, updateDoc } from "firebase/firestore";
import { deleteDoc } from "firebase/firestore";

const addPantryItem = async (db, userId, itemData) => {
  try {
    // Create a reference to the user's document in the pantry collection
    const userDocRef = doc(db, "pantry", userId);

    // Create a reference to the items sub-collection inside the user's document
    const itemsCollectionRef = collection(userDocRef, "items");

    // Add a new document to the items sub-collection with the provided item data
    const docRef = await addDoc(itemsCollectionRef, {
      item: itemData.item,
      quantity: itemData.quantity,
      expiry_date: itemData.expiry_date,
    });

    console.log("Item added with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding item: ", e);
  }
};

const updatePantryItem = async (db, userId, itemId, updatedData) => {
  try {
    // Create a reference to the specific item document
    const itemDocRef = doc(db, "pantry", userId, "items", itemId);

    // Update the item document with the new data
    await updateDoc(itemDocRef, updatedData);

    console.log("Item updated");
  } catch (e) {
    console.error("Error updating item: ", e);
  }
};

const deletePantryItem = async (db, userId, itemId) => {
  try {
    // Create a reference to the specific item document
    const itemDocRef = doc(db, "pantry", userId, "items", itemId);

    // Delete the item document
    await deleteDoc(itemDocRef);

    console.log("Item deleted");
  } catch (e) {
    console.error("Error deleting item: ", e);
  }
};

export { addPantryItem, updatePantryItem, deletePantryItem };

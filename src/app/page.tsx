"use client";

import Image from "next/image";
import styles from "./page.module.css";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  InputAdornment,
  Paper,
  TextField,
  Toolbar,
} from "@mui/material";
import { Typography } from "@mui/material";
import { Search } from "@mui/icons-material";
import Datagrid from "./Datagrid";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import useAuth from "./useAuth";
import { useState } from "react";
import { auth, db } from "./firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect } from "react";
import { addPantryItem, updatePantryItem, deletePantryItem } from "./crud";
import { DatePicker } from "@mui/x-date-pickers";
import { collection, addDoc } from "firebase/firestore";
import { query, where, getDocs } from "firebase/firestore";
import { doc } from "firebase/firestore";
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_APIKEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

interface Item {
  id: string;
  item: string;
  quantity: number;
  expiry_date: string;
}

export default function Home() {
  // const [email, setEmail] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [item, setItem] = useState("");
  const [expiry_date, setexpiry_date] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [items, setItems] = useState<Item[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchItems(user.uid);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const session = useSession({
    required: true,

    onUnauthenticated() {
      redirect("/signin");
    },
  });

  const fetchItems = async (userId: string) => {
    const items = await readPantryItems(db, userId);
    setItems(items);
  };

  const handleAddItem = async (e: Event) => {
    e.preventDefault();
    if (user) {
      await addPantryItem(db, user.uid, {
        item,
        quantity,
        expiry_date,
      });
      fetchItems(user.uid); // Refresh items after adding
    }
  };
  const readPantryItems = async (db: any, userId: string): Promise<Item[]> => {
    try {
      const itemsCollectionRef = collection(doc(db, "pantry", userId), "items");
      const querySnapshot = await getDocs(itemsCollectionRef);
      const items = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        item: doc.data().item,
        quantity: doc.data().quantity,
        expiry_date: doc.data().expiry_date,
      })) as Item[];
      return items;
    } catch (e) {
      console.error("Error reading items: ", e);
      return [];
    }
  };

  async function Gemini() {
    const prompt = `Generate a recipe with these ingredients: ${items
      .map((item) => item.item)
      .join(", ")}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    setText(text);
    textExtract;
  }

  function textExtract() {
    const title = text.split("\n")[0];
    const ingredients = text.split("\n").slice(1, -1);

    return { title, ingredients };
  }

  return (
    <main className={styles.main}>
      <AppBar position="fixed" color="default">
        <Container maxWidth="xl">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
              }}
            >
              <Image
                src="/baozi.png"
                alt="Pantry Tracker"
                width={50}
                height={50}
                objectFit="contain"
              />
              <Typography variant="h6" fontWeight={"bold"}>
                Pantry Tracker
              </Typography>
            </Box>

            <Button
              onClick={() => {
                if (user) {
                  signOut();
                  setUser(null);
                }
              }}
            >
              Sign Out
            </Button>
            {/* <Avatar alt="User" /> */}
          </Box>
        </Container>
      </AppBar>
      <Toolbar />
      <Container>
        {/* <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: 10,
          }}
        >
          <TextField
            label="Search"
            placeholder="Search"
            variant="outlined"
            sx={{
              width: "300px",
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Box> */}
        <Box
          sx={{
            marginTop: 6,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <form
              style={{ display: "flex", justifyContent: "center" }}
              onSubmit={async (e) => {
                e.preventDefault();
                await addPantryItem(db, user?.uid, {
                  item,
                  quantity,
                  expiry_date,
                });
                fetchItems(user!.uid);
              }}
            >
              <TextField
                sx={{ marginRight: 2 }}
                onChange={(e) => setItem(e.target.value)}
                label="Name"
              ></TextField>
              <TextField
                sx={{ marginRight: 2 }}
                type="number"
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                label="Quantity"
              ></TextField>
              <TextField
                sx={{ marginRight: 2 }}
                type="date"
                onChange={(e) => setexpiry_date(e.target.value)}
                label="Expiry"
              ></TextField>
              {/* <DatePicker label="Expiry Date" /> */}
              <Button type="submit" sx={{ bgcolor: "black", color: "white" }}>
                Add
              </Button>
            </form>
          </Box>
          {/* <Datagrid /> */}
          {/* rows={readPantryItems(db,user?.uid)} */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "80%",
              marginX: "auto",
              marginTop: 3,
            }}
          >
            <Typography variant="h5">Item</Typography>
            <Typography variant="h5">Quantity</Typography>
            <Typography variant="h5">Expiry</Typography>
            <Typography variant="h5">Action</Typography>
          </Box>
          {items.length > 0 ? (
            items.map((item) => (
              <Box
                key={item.id}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 2,
                }}
              >
                <Paper
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: 2,
                    width: "80%",
                  }}
                >
                  <Typography>{item.item}</Typography>
                  <Typography>{item.quantity}</Typography>
                  <Typography>{item.expiry_date}</Typography>
                  <Button
                    onClick={() => {
                      if (user) {
                        deletePantryItem(db, user.uid, item.id);
                        fetchItems(user.uid); // Refresh items after deleting
                      }
                    }}
                  >
                    Delete
                  </Button>
                </Paper>
              </Box>
            ))
          ) : (
            <Typography sx={{ textAlign: "center" }}>
              ...fetching data
            </Typography>
          )}
          <Button
            sx={{
              marginTop: 4,
              bgcolor: "black",
              color: "white",
              width: "200px",
              fontWeight: "bold",
              paddingY: 2,
              alignSelf: "center",
            }}
            onClick={Gemini}
          >
            Generate Recipe
          </Button>
          {text.length > 0 && (
            <Box
              sx={{
                marginTop: 4,
                width: "80%",
                border: "ActiveBorder",
                marginX: "auto",
              }}
            >
              <Typography variant="h5">{textExtract().title}</Typography>
              <Typography>{textExtract().ingredients}</Typography>
            </Box>
          )}
        </Box>
      </Container>
    </main>
  );
}

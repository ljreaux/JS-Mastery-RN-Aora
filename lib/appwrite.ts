import { itemType } from "@/components/Trending";
import {
  Client,
  Account,
  ID,
  Avatars,
  Databases,
  Query,
} from "react-native-appwrite";
export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.jsm.aora",
  projectId: "66529923002689d9acbe",
  databaseId: "66529a2f002f0e562f25",
  userCollectionId: "66529a5600098dda1a36",
  videoCollectionId: "66529a770008199a166c",
  storageId: "66529bf900060f053e76",
};

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(config.endpoint) // Your Appwrite Endpoint
  .setProject(config.projectId) // Your project ID
  .setPlatform(config.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async (
  email: string,
  password: string,
  username: string
) => {
  // Register User
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );
    if (!newAccount) throw new Error();
    const avatarUrl = avatars.getInitials(username);
    await signIn(email, password);

    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      { accountId: newAccount.$id, email, username, avatar: avatarUrl }
    );
    return newUser;
  } catch (error) {
    console.error(error);
    throw new Error();
  }
};
export async function signIn(
  email: string,
  password: string,
  loggingIn?: boolean
) {
  try {
    if (loggingIn) await account.deleteSession("current");
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    console.error(error);
    throw new Error();
  }
}

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );
    if (!currentUser) throw Error;
    return currentUser.documents[0];
  } catch (error) {
    console.error(error);
    throw new Error();
  }
};

export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId
    );
    return posts.documents as unknown as itemType[];
  } catch (error) {
    console.error(error);
    throw new Error();
  }
};

export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(7)]
    );
    return posts.documents as unknown as itemType[];
  } catch (error) {
    console.error(error);
    throw new Error();
  }
};

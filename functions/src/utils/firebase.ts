import {initializeApp} from "firebase-admin/app";
import {getAuth as fbGetAuth} from "firebase-admin/auth";
import {getFirestore} from "firebase-admin/firestore";
import {singleton} from "@anhzf/evote-shared/utils";

initializeApp();

export const getDb = singleton(() => getFirestore());

export const getAuth = singleton(() => fbGetAuth());

"use strict";var k=Object.create;var r=Object.defineProperty;var T=Object.getOwnPropertyDescriptor;var x=Object.getOwnPropertyNames;var V=Object.getPrototypeOf,A=Object.prototype.hasOwnProperty;var m=(o,t)=>{for(var e in t)r(o,e,{get:t[e],enumerable:!0})},f=(o,t,e,a)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of x(t))!A.call(o,n)&&n!==e&&r(o,n,{get:()=>t[n],enumerable:!(a=T(t,n))||a.enumerable});return o};var E=(o,t,e)=>(e=o!=null?k(V(o)):{},f(t||!o||!o.__esModule?r(e,"default",{value:o,enumerable:!0}):e,o)),w=o=>f(r({},"__esModule",{value:!0}),o);var I={};m(I,{auth:()=>s});module.exports=w(I);var s={};m(s,{loginWithVoteToken:()=>b});var i=E(require("firebase-functions"));var u=require("firebase-admin/app"),g=require("firebase-admin/auth"),h=require("firebase-admin/firestore");var c=o=>{let t;return(...e)=>(t||(t=o(...e)),t)};(0,u.initializeApp)();var d=c(()=>(0,h.getFirestore)()),l=c(()=>(0,g.getAuth)());var b=i.https.onCall(async o=>{let{votingEventId:t,voteToken:e}=o;if(!t||!e)throw new i.https.HttpsError("invalid-argument","votingEventId and voteTokenId are required");let n=await d().doc(`VotingEvent/${t}/VotingToken/${e}`).get(),p=n.data();if(n.exists&&!(p!=null&&p.deletedAt)){let v={scope:t};return l().createCustomToken(`VotingEvent/${t}/VoteToken/${e}`,v)}throw new i.https.HttpsError("unauthenticated","Invalid vote token")});0&&(module.exports={auth});

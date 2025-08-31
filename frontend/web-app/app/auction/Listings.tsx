import React from "react";

async function getData() {
  const res = await fetch("http://localhost");
  if (!res.ok) throw new Error("Failed in fetch");
  return res.json();
}
export default async function Listings() {
  return <div>Listings</div>;
}

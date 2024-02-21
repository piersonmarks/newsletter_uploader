import { Items } from "./components/Items";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-2xl mx-auto text-center font-bold mb-2">
        Newsletter Submissions
      </h1>
      <p className="italic mt-2 mb-8">
        This a website to cycle through all the newsletter submissions for
        Jellypod&apos;s newsletter database.
      </p>
      <Items />
    </main>
  );
}

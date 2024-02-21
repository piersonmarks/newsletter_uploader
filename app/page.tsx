import Image from "next/image";
import supabase from "@/utils/supabase";
import { Items } from "./components/Items";

export default async function Home() {
  const { data, error } = await supabase.from("NewsletterSubmissions").select();

  if (error) {
    console.error(error);
    return <div>Error</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-2xl mx-auto text-center font-bold mb-2">
        Newsletter Submissions
      </h1>
      <p className="italic mt-2 mb-8">
        This a website to cycle through all the newsletter submissions for
        Jellypod&apos;s newsletter database.
      </p>
      <Items data={data} />
      <p className="text-sm mt-2">Number of Submissions: {data.length}</p>
    </main>
  );
}

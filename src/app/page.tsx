import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Team 3 EBook</h1>
        <p className="text-lg mb-8">
          Discover a world of knowledge with our extensive collection of eBooks.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/auth/sign-in"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-500"
          >
            Sign In
          </Link>
          <Link
            href="/auth/sign-up"
            className="px-6 py-3 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white"
          >
            Sign Up
          </Link>
        </div>
      </div>
      <div className="mt-10">
        <Image
          src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80"
          alt="EBook Cover"
          width={400}
          height={600}
          className="rounded-md shadow-lg"
        />
      </div>
    </div>
  );
}
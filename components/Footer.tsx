export default function Footer() {
  return (
    <footer className="bg-black py-10 text-center mt-20">
      <p>© {new Date().getFullYear()} Kids Card</p>
      <p className="text-sm text-gray-400 mt-2">
        Fintech especializada em pensão alimentícia e mesada digital.
      </p>
    </footer>
  );
}
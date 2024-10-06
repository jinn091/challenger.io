import { Link } from "@remix-run/react";
import { SearchIcon } from "../icons";

export default function Header(): JSX.Element {
  return (
    <nav className="shadow-sm shadow-neutral-400 flex items-center justify-between px-8">
      <Link to="/">
        <img src="/images/logo.png" alt="logo" width={200} height={50} />
      </Link>

      <div className="flex bg-[#2b2a33] items-center px-2 rounded">
        <input type="text" className="py-1 outline-none" />
        <SearchIcon className="fill-white" width={20} height={20}/>
      </div>

      <div>
        <button>Sign In With Google</button>
      </div>
    </nav>
  );
}

"use client";
import Link from "next/link";
import { CiCalendar } from "react-icons/ci";
import { FaInstagram } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaRegCopyright } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { FaPhone } from "react-icons/fa";

const Footer = () => {
  return (
    <footer>
      <div className="bg-white flex-col flex">
        <div className="m-auto bg-white flex-row flex justify-around w-[calc(90%)] items-center pt-5 pb-5  border-b-2">
          <div className="flex flex-row justify-center items-center basis-80 text-gray-800">
            <CiCalendar className="text-3xl mr-5" />
            <p className="text-xl font-semibold tracking-wider italic">
              Interaktivni kalendar
            </p>
          </div>
          <div className="flex flex-row justify-between items-center basis-128 text-md font-medium text-gray-800">
            <Link
              href="/"
              className="pt-1.5 pb-1.5 pr-3 pl-3 hover:bg-pink-500 hover:text-white rounded-md hover:font-semibold tracking-wider"
            >
              POCETNA
            </Link>
            <Link
              href="/kalendar"
              className="pt-1.5 pb-1.5 pr-3 pl-3 hover:bg-pink-500 hover:text-white rounded-md hover:font-semibold tracking-wider"
            >
              KALENDAR
            </Link>
            <Link
              href="/o-nama"
              className="pt-1.5 pb-1.5 pr-3 pl-3 hover:bg-pink-500 hover:text-white rounded-md hover:font-semibold tracking-wider"
            >
              O NAMA
            </Link>
          </div>
          <div className="basis-64 flex flex-row justify-around items-center">
            <FaInstagram className="text-2xl cursor-pointer" />
            <FaFacebook className="text-2xl cursor-pointer" />
            <FaSquareXTwitter className="text-3xl cursor-pointer" />
          </div>
        </div>
        <div className="flex flex-col p-5 w-full pb-0 pr-0 pl-0">
          <div className="flex flex-row justify-around items-center text-gray-800 trackin-wider mb-5">
            <p className="text-lg font-medium text-center items-center flex flex-row">
              {" "}
              <IoIosMail className="text-2xl mr-3 cursor-pointer"/> Kontakt
              email:{" "}
              <a
                href="mailto:kalendar@gmail.com"
                className="text-lg font-medium"
              >
                kalendar@gmail.com
              </a>
            </p>
            <p className="text-lg font-medium text-center items-center flex flex-row">
              {" "}
              <FaPhone className="text-2xl mr-3 cursor-pointer"/>
              Kontakt telefon:{" "}
              <a href="tel:+381 435 242" className="text-lg font-medium">
                +381 435 242
              </a>
            </p>
          </div>
          <div className="flex flex-row justify-center items-center bg-pink-back pt-4 pb-4">
            <FaRegCopyright className="text-lg mr-2" />
            <p className="text-md font-semibold">All Rights Reserved</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

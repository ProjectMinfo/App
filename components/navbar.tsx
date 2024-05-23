'use client';
import React, { useState } from "react";
import { Button, Dropdown, DropdownItem, Spacer } from "@nextui-org/react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="h-screen bg-dark-700 text-white py-4 px-4">
      <div className="flex flex-col">
        <h2 className="text-white text-2xl font-semibold mb-4">ACME</h2>
        <div className="flex flex-col space-y-4">
          <Button
            auto
            ghost
            bordered
            color="primary"
            className="mb-2"
          >
            Home
          </Button>
          <Button
            auto
            ghost
            bordered
            color="primary"
            className="mb-2"
          >
            Projects
          </Button>
          <Button
            auto
            ghost
            bordered
            color="primary"
            className="mb-2"
          >
            Tasks
          </Button>
          <Button
            auto
            ghost
            bordered
            color="primary"
            className="mb-2"
          >
            Team
          </Button>
          <Button
            auto
            ghost
            bordered
            color="primary"
            className="mb-2"
          >
            Tracker
          </Button>
          <Button
            auto
            ghost
            bordered
            color="primary"
            className="mb-2"
          >
            Analytics
          </Button>
          <Button
            auto
            ghost
            bordered
            color="primary"
            className="mb-2"
          >
            Perks
          </Button>
          <Button
            auto
            ghost
            bordered
            color="primary"
            className="mb-2"
          >
            Expenses
          </Button>
          <Button
            auto
            ghost
            bordered
            color="primary"
            className="mb-2"
          >
            Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
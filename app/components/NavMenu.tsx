"use client";

import { Offcanvas, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

type NavMenuProps = {
  show: boolean;
  toggleShow: () => void;
};

/**
 * 画面右からスライドインするナビゲーションメニュー(Home/About/Contact)。
 */
export const NavMenu = ({ show, toggleShow }: NavMenuProps) => {
  return (
    <Offcanvas show={show} onHide={toggleShow} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>My SPA Site</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Nav className="flex-column">
          <Nav.Link as={Link} to="/*" onClick={toggleShow}>
            Home
          </Nav.Link>
          <Nav.Link as={Link} to="/about" onClick={toggleShow}>
            About
          </Nav.Link>
          <Nav.Link as={Link} to="/contact" onClick={toggleShow}>
            Contact
          </Nav.Link>
        </Nav>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

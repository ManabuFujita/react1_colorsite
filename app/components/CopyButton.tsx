"use client";

import { useState } from 'react';
import { Button } from 'react-bootstrap';
import copy from "clipboard-copy"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from "@fortawesome/free-regular-svg-icons";

type CopyButtonProps = {
  copyText: string;
  inputId: string;
};

/**
 * ボタン押下でテキストをクリップボードにコピーする。
 * コピー直後の数秒間は再押下できないようdisabledにする。
 */
export const CopyButton = ({ copyText, inputId }: CopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = () => {
    // const elem = document.getElementById(id);
    // elem?.select();
    const input = document.getElementById(inputId) as HTMLInputElement;
    if (input !== null) {
      input.focus();
      input.select();
    }


    copy(copyText).then(() => {
      setIsCopied(true)
      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    })
  }

  return (

    <Button disabled={isCopied} onClick={handleCopy} className='copy-button' variant="outline-secondary">
      {/* {isCopied ? "Copied!" : "Copy"} */}
      {/* <i class="fa-solid fa-copy"></i> */}
      <FontAwesomeIcon icon={faCopy} />
    </Button>
  )
}

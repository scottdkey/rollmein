import { apiUrl } from './constants';

import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMutation } from "react-query";

const CheckAuth = (token: string) => useMutation(async () => {
  const res = await fetch(`${apiUrl}/user/check`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
})
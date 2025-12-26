import { useState, useEffect } from "react";
import { defaultHeaders } from "../api/encrypt";
import { useAppSelector } from "../store/hooks";

interface FetchResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

function decodeBase64ToJson<T>(base64String: string): T | null {
  try {
    const decodedString = atob(base64String);
    return JSON.parse(decodedString) as T;
  } catch (error) {
    console.error("Failed to decode base64 or parse JSON:", error);
    return null;
  }
}

export function useFetchData<T>(url: string): FetchResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { userKey } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!userKey) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const headers = { ...defaultHeaders };
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}users/${url}`,
          {
            method: "GET",
            headers,
          }
        );

        if (!response.ok) {
          throw new Error(
            `HTTP error! Status: ${response.status}, Status Text: ${response.statusText}`
          );
        }

        const responseData = await response.json();
        const decodedData = responseData?.resp
          ? decodeBase64ToJson<T>(responseData.resp)
          : null;
        setData(decodedData);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, userKey]);

  return { data, error, loading };
}

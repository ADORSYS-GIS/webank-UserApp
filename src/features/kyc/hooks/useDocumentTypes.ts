import { useState, useEffect } from "react";

interface DocumentType {
  id: string;
  name: string;
}

interface UseDocumentTypesResult {
  documentTypes: DocumentType[];
  loading: boolean;
  error: Error | null;
}

const useDocumentTypes = (): UseDocumentTypesResult => {
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // This would be replaced with an actual API call
    const fetchDocumentTypes = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Mock data
        const mockData: DocumentType[] = [
          { id: "id_card", name: "ID CARD" },
          { id: "passport", name: "PASSPORT" },
          { id: "driving_license", name: "DRIVING LICENSE" },
        ];

        setDocumentTypes(mockData);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to load document types"),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentTypes();
  }, []);

  return { documentTypes, loading, error };
};

export { useDocumentTypes };

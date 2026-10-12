import { siteConfig } from "@/lib/site-config";

export const INDEXNOW_KEY =
  process.env.INDEXNOW_KEY || "5b4dd40b7c5541babe8307ca504528dd";

export interface IndexNowPayload {
  host: string;
  key: string;
  keyLocation?: string;
  urlList: string[];
}

export interface IndexNowResult {
  success: boolean;
  status: number;
  message: string;
  submittedUrls: string[];
}

/**
 * Submits a list of URLs to the IndexNow API (shared across Bing, Yandex, Seznam, Naver).
 * IndexNow allows up to 10,000 URLs per submission.
 */
export async function submitToIndexNow(
  urls: string[],
  key: string = INDEXNOW_KEY
): Promise<IndexNowResult> {
  const baseUrl =
    siteConfig.url && !siteConfig.url.includes("localhost")
      ? siteConfig.url
      : "https://sinpaktedarik.com";
  const host = new URL(baseUrl).host;
  const keyLocation = `${baseUrl}/${key}.txt`;

  if (urls.length === 0) {
    return {
      success: true,
      status: 200,
      message: "Gönderilecek URL listesi boş.",
      submittedUrls: [],
    };
  }

  const payload: IndexNowPayload = {
    host,
    key,
    keyLocation,
    urlList: urls,
  };

  try {
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    // 200 OK or 202 Accepted indicates successful receipt
    const success = response.status === 200 || response.status === 202;
    const responseText = await response.text();

    return {
      success,
      status: response.status,
      message: success
        ? "IndexNow başarıyla güncellendi (Bing, Yandex ve diğer arama motorlarına iletildi)."
        : `IndexNow hatası (${response.status}): ${responseText || response.statusText}`,
      submittedUrls: urls,
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      message:
        error instanceof Error
          ? error.message
          : "IndexNow API çağrısı sırasında beklenmeyen bir hata oluştu.",
      submittedUrls: urls,
    };
  }
}

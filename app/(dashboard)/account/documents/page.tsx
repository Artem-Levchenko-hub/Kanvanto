import Link from "next/link";
import { FileText, Download, ArrowRight } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/client";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/lib/utils/format";
import type { DocumentType } from "@prisma/client";

export const metadata = { title: "Документы" };

const DOC_LABELS: Record<DocumentType, string> = {
  ORDER_FORM: "Заказ-наряд",
  WARRANTY: "Гарантийный талон",
  INVOICE: "Счёт",
  ACT: "Акт выполненных работ",
  PHOTO: "Фото",
  OTHER: "Прочее",
};

export default async function DocumentsPage() {
  const session = await auth();
  const userId = session!.user.id;

  const documents = await prisma.document.findMany({
    where: { userId },
    include: {
      car: { select: { brand: true, model: true, year: true } },
      order: { select: { number: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <Container className="py-6 lg:py-10">
      <div className="mb-6">
        <h1 className="font-display text-h1 text-graphite-50">Документы</h1>
        <p className="mt-2 text-body-base text-graphite-200">
          Заказ-наряды, гарантийные талоны, счета. Скачайте PDF в один клик.
        </p>
      </div>

      {documents.length === 0 ? (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <FileText className="size-12 text-graphite-400 mx-auto mb-4" />
            <h2 className="font-display text-h3 text-graphite-50">Документов пока нет</h2>
            <p className="mt-2 text-body-base text-graphite-200 max-w-md mx-auto">
              После выполнения заказов сюда автоматически попадут заказ-наряды и гарантии в формате PDF.
            </p>
            <Button asChild className="mt-6">
              <Link href="/booking">
                Записаться на ТО
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">Все ({documents.length})</TabsTrigger>
            <TabsTrigger value="orders">
              Заказ-наряды ({documents.filter((d) => d.type === "ORDER_FORM").length})
            </TabsTrigger>
            <TabsTrigger value="warranty">
              Гарантии ({documents.filter((d) => d.type === "WARRANTY").length})
            </TabsTrigger>
          </TabsList>

          {(["all", "orders", "warranty"] as const).map((tab) => (
            <TabsContent key={tab} value={tab}>
              <div className="space-y-2">
                {documents
                  .filter((d) =>
                    tab === "all"
                      ? true
                      : tab === "orders"
                        ? d.type === "ORDER_FORM"
                        : d.type === "WARRANTY"
                  )
                  .map((doc) => (
                    <Card key={doc.id}>
                      <CardContent className="pt-5 pb-5 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="size-10 rounded-md bg-graphite-700 grid place-items-center text-chrome shrink-0">
                            <FileText className="size-5" strokeWidth={1.5} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-body-base text-graphite-50 font-medium truncate">
                              {DOC_LABELS[doc.type]}
                              {doc.order ? ` · ${doc.order.number}` : ""}
                            </p>
                            <p className="text-caption text-chrome mt-0.5">
                              {doc.car
                                ? `${doc.car.brand} ${doc.car.model} ${doc.car.year} · `
                                : ""}
                              {formatDate(doc.createdAt)} · {(doc.fileSizeBytes / 1024).toFixed(0)} KB
                            </p>
                          </div>
                        </div>
                        <Button asChild size="sm" variant="outline">
                          <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                            <Download className="size-3.5" />
                            Скачать
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </Container>
  );
}

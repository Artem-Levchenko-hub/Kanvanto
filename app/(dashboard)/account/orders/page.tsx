import Link from "next/link";
import { ClipboardList, ArrowRight } from "lucide-react";
import { auth } from "@/auth";
import { getMyOrders } from "@/lib/db/orders";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderRow } from "@/components/dashboard/OrderRow";

export const metadata = { title: "История заказов" };

export default async function OrdersPage() {
  const session = await auth();
  const userId = session!.user.id;
  const orders = await getMyOrders(userId);

  return (
    <Container className="py-6 lg:py-10">
      <div className="mb-6">
        <h1 className="font-display text-h1 text-graphite-50">История заказов</h1>
        <p className="mt-2 text-body-base text-graphite-200">
          Все работы по вашим авто. Заказ-наряды и гарантии — в один клик.
        </p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <ClipboardList className="size-12 text-graphite-400 mx-auto mb-4" />
            <h2 className="font-display text-h3 text-graphite-50">Истории работ пока нет</h2>
            <p className="mt-2 text-body-base text-graphite-200 max-w-md mx-auto">
              Запишитесь на первое обслуживание — здесь появится полная история всех работ.
            </p>
            <Button asChild className="mt-6">
              <Link href="/booking">
                Записаться
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <OrderRow key={order.id} order={order} />
          ))}
        </div>
      )}
    </Container>
  );
}

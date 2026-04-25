import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { Order, OrderItem, Branch, User, Car } from "@prisma/client";

const COLORS = {
  bg: "#FFFFFF",
  text: "#0A0A0B",
  muted: "#6E6E76",
  divider: "#E2E8F0",
  accent: "#DC2626",
  chrome: "#7A7A82",
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: COLORS.bg,
    color: COLORS.text,
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
    paddingBottom: 12,
    borderBottom: `1px solid ${COLORS.divider}`,
  },
  brand: {
    fontFamily: "Helvetica-Bold",
    fontSize: 22,
    color: COLORS.text,
  },
  brandTagline: {
    fontSize: 8,
    color: COLORS.chrome,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginTop: 2,
  },
  docTitle: {
    fontSize: 8,
    color: COLORS.chrome,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    textAlign: "right",
  },
  docNumber: {
    fontFamily: "Helvetica-Bold",
    fontSize: 18,
    marginTop: 4,
    textAlign: "right",
  },
  meta: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 20,
  },
  metaCol: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 7,
    color: COLORS.chrome,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 10,
    color: COLORS.text,
  },
  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    color: COLORS.text,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 16,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottom: `1px solid ${COLORS.divider}`,
  },
  table: {
    flexDirection: "column",
    marginBottom: 8,
  },
  tableHead: {
    flexDirection: "row",
    backgroundColor: "#F8F8FA",
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontSize: 7,
    color: COLORS.chrome,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottom: `1px solid ${COLORS.divider}`,
  },
  cellTitle: { flex: 4, fontSize: 9 },
  cellQty: { flex: 1, textAlign: "right", fontSize: 9 },
  cellPrice: { flex: 1.5, textAlign: "right", fontSize: 9 },
  cellTotal: { flex: 1.5, textAlign: "right", fontSize: 9 },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    fontSize: 10,
  },
  totalsRowLabel: {
    color: COLORS.muted,
  },
  totalsRowValue: {
    fontFamily: "Helvetica-Bold",
  },
  grandTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingTop: 12,
    marginTop: 4,
    borderTop: `2px solid ${COLORS.text}`,
    fontFamily: "Helvetica-Bold",
    fontSize: 14,
  },
  warranty: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#F8F8FA",
    border: `1px solid ${COLORS.divider}`,
    borderRadius: 4,
  },
  warrantyTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    marginBottom: 4,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 8,
    color: COLORS.muted,
    textAlign: "center",
    paddingTop: 12,
    borderTop: `1px solid ${COLORS.divider}`,
  },
});

const formatPrice = (n: number) =>
  new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(n);

const formatDate = (d: Date | string) =>
  new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(d));

const BRAND_LABELS: Record<string, string> = {
  BMW: "BMW", MERCEDES: "Mercedes-Benz", AUDI: "Audi", PORSCHE: "Porsche",
  SKODA: "Škoda", VW: "Volkswagen", OTHER: "—",
};

interface OrderPdfProps {
  order: Order & { items: OrderItem[] };
  user: User;
  car: Car;
  branch: Branch;
}

export function OrderPdfDocument({ order, user, car, branch }: OrderPdfProps) {
  const labor = order.items.filter((i) => i.type === "LABOR");
  const parts = order.items.filter((i) => i.type === "PART");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>KANAVTO</Text>
            <Text style={styles.brandTagline}>Premium Auto Service</Text>
          </View>
          <View>
            <Text style={styles.docTitle}>ЗАКАЗ-НАРЯД</Text>
            <Text style={styles.docNumber}>{order.number}</Text>
          </View>
        </View>

        <View style={styles.meta}>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>Дата</Text>
            <Text style={styles.metaValue}>{formatDate(order.startedAt)}</Text>
          </View>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>Филиал</Text>
            <Text style={styles.metaValue}>{branch.name}</Text>
            <Text style={[styles.metaValue, { fontSize: 8, color: COLORS.muted, marginTop: 2 }]}>{branch.address}</Text>
          </View>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>Мастер</Text>
            <Text style={styles.metaValue}>{order.masterName || "—"}</Text>
          </View>
        </View>

        <View style={styles.meta}>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>Клиент</Text>
            <Text style={styles.metaValue}>{user.name || "—"}</Text>
            <Text style={[styles.metaValue, { fontSize: 8, color: COLORS.muted, marginTop: 2 }]}>{user.phone}</Text>
          </View>
          <View style={[styles.metaCol, { flex: 2 }]}>
            <Text style={styles.metaLabel}>Автомобиль</Text>
            <Text style={styles.metaValue}>
              {BRAND_LABELS[car.brand] || car.brand} {car.model} {car.year}
            </Text>
            <Text style={[styles.metaValue, { fontSize: 8, color: COLORS.muted, marginTop: 2 }]}>
              {car.vin ? `VIN: ${car.vin}` : ""}{car.licensePlate ? ` · ${car.licensePlate}` : ""} · Пробег: {order.mileageAtService.toLocaleString("ru-RU")} км
            </Text>
          </View>
        </View>

        {labor.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Работы</Text>
            <View style={styles.table}>
              <View style={styles.tableHead}>
                <Text style={styles.cellTitle}>Наименование</Text>
                <Text style={styles.cellQty}>Кол-во</Text>
                <Text style={styles.cellPrice}>Цена</Text>
                <Text style={styles.cellTotal}>Сумма</Text>
              </View>
              {labor.map((item) => (
                <View key={item.id} style={styles.tableRow}>
                  <Text style={styles.cellTitle}>{item.title}</Text>
                  <Text style={styles.cellQty}>{item.quantity}</Text>
                  <Text style={styles.cellPrice}>{formatPrice(item.unitPrice)}</Text>
                  <Text style={styles.cellTotal}>{formatPrice(item.totalPrice)}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {parts.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Запасные части</Text>
            <View style={styles.table}>
              <View style={styles.tableHead}>
                <Text style={styles.cellTitle}>Наименование</Text>
                <Text style={styles.cellQty}>Кол-во</Text>
                <Text style={styles.cellPrice}>Цена</Text>
                <Text style={styles.cellTotal}>Сумма</Text>
              </View>
              {parts.map((item) => (
                <View key={item.id} style={styles.tableRow}>
                  <View style={styles.cellTitle}>
                    <Text>{item.title}</Text>
                    {item.partOrigin && (
                      <Text style={{ fontSize: 7, color: COLORS.muted, marginTop: 1 }}>
                        {item.partOrigin === "ORIGINAL" ? "Оригинал" : item.partOrigin === "ANALOG" ? "Аналог" : "Б/у"}
                        {item.partNumber ? ` · ${item.partNumber}` : ""}
                      </Text>
                    )}
                  </View>
                  <Text style={styles.cellQty}>{item.quantity}</Text>
                  <Text style={styles.cellPrice}>{formatPrice(item.unitPrice)}</Text>
                  <Text style={styles.cellTotal}>{formatPrice(item.totalPrice)}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        <Text style={styles.sectionTitle}>Итого</Text>
        <View>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsRowLabel}>Работы</Text>
            <Text style={styles.totalsRowValue}>{formatPrice(order.laborAmount)}</Text>
          </View>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsRowLabel}>Запчасти</Text>
            <Text style={styles.totalsRowValue}>{formatPrice(order.partsAmount)}</Text>
          </View>
          {order.discountAmount > 0 && (
            <View style={styles.totalsRow}>
              <Text style={styles.totalsRowLabel}>Скидка</Text>
              <Text style={[styles.totalsRowValue, { color: COLORS.accent }]}>−{formatPrice(order.discountAmount)}</Text>
            </View>
          )}
          <View style={styles.grandTotal}>
            <Text>К оплате</Text>
            <Text style={{ color: COLORS.accent }}>{formatPrice(order.totalAmount)}</Text>
          </View>
        </View>

        <View style={styles.warranty}>
          <Text style={styles.warrantyTitle}>Гарантийные условия</Text>
          <Text>
            Гарантия на работы и запчасти — {order.warrantyMonths} месяцев или {order.warrantyKm.toLocaleString("ru-RU")} км пробега
            (что наступит раньше) с {formatDate(order.warrantyStartDate)}.
          </Text>
          <Text style={{ marginTop: 4, fontSize: 8, color: COLORS.muted }}>
            При обращении по гарантии — предъявите этот документ или его электронную копию из личного кабинета.
          </Text>
        </View>

        <Text style={styles.footer}>
          ООО «Канавто» · ИНН 2310123456 · ОГРН 1052310987654 · 350001, Краснодар, ул. Будённого, 356 · +7 (905) 405-1111 · kanavto.com
        </Text>
      </Page>
    </Document>
  );
}

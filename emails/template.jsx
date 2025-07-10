import {
  Body,
  Button,
  Container,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Head,
} from "@react-email/components";
import * as React from "react";

export default function EmailTemplate({
  userName = "",
  type = "budget-alert",
  data = {},
}) {
  console.log("data ==>", data);
  if (type === "monthly-report") {
  }
  if (type === "budget-alert") {
    return (
      <Html>
        <Head />
        <Preview>Budget Alert</Preview>
        <Body style={styles.body}></Body>
        <Container style={styles.container}>
          <Heading style={styles.title}>Budget Alert</Heading>
          <Text style={styles.text}>Hello {userName}</Text>
          <Text>
            You&rsquo;ve used {data?.percentageUsed.toFixed(1)}% of your budget
            this month.
          </Text>
          <Section style={styles.statsContainer}>
            <div style={styles.stats}>
              <Text style={styles.text}>Budget Amount</Text>
              <Text style={styles.heading}>${data?.budgetAmount}</Text>
            </div>
            <div style={styles.stats}>
              <Text style={styles.text}>Spent Amount</Text>
              <Text style={styles.heading}>Rs {data?.totalExpenses}</Text>
            </div>
            <div style={styles.stats}>
              <Text style={styles.text}>Remaining Amount</Text>
              <Text style={styles.heading}>
                Rs {data?.budgetAmount - data?.totalExpenses}
              </Text>
            </div>
          </Section>
        </Container>
      </Html>
    );
  }
}

const styles = {
  body: {
    backgroundColor: "#f6f9fc",
    fontFamily: "-apple-system, sans-serif",
  },
  container: {
    backgroundColor: "#ffffff",
    borderRadius: "5px",
    padding: "20px",
    margin: "0 auto",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  title: {
    color: "#1f2937",
    fontSize: "32px",
    fontweight: "bold",
    textAlign: "center",
    margin: "0 0 20px",
  },
  heading: {
    color: "#1f2937",
    fontSize: "20px",
    fontWeight: "600",
    margin: "0 0 16px",
  },
  text: {
    color: "#4b5563",
    fontSize: "16px",
    lineHeight: "1.5",
    margin: "0 0 16px",
  },
  statsContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
    borderRadius: "5px",
    padding: "20px",
  },
  stats: {
    marginBottom: "16px",
    backgroundColor: "#fff",
    padding: "12px",
    borderRadius: "5px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
  },
};

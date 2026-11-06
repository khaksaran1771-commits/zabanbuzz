"use client";

import { Button, Card, Chip } from "@heroui/react";
import { useState } from "react";

const OPTIONS = ["have", "had", "will have", "have had"];
const ANSWER = 1;

export function SampleQuestion() {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;

  return (
    <Card className="p-5 shadow-sm sm:p-6">
      <Card.Header className="flex-row items-center justify-between gap-3">
        <Card.Title className="text-sm font-semibold">یک سؤال نمونه</Card.Title>
        <Chip size="sm" variant="soft">
          گرامر
        </Chip>
      </Card.Header>

      <Card.Content className="mt-4 gap-4">
        <p dir="ltr" className="text-lg leading-8 font-medium">
          If I ____ more time, I would study harder.
        </p>

        <div dir="ltr" className="grid gap-2 sm:grid-cols-2">
          {OPTIONS.map((option, index) => {
            const isAnswer = index === ANSWER;
            const isPicked = index === selected;
            const wrongPick = answered && isPicked && !isAnswer;

            return (
              <Button
                key={option}
                fullWidth
                variant={wrongPick ? "danger-soft" : "outline"}
                // Not isDisabled: that would dim the correct answer once it's revealed.
                onPress={() => {
                  if (!answered) setSelected(index);
                }}
                className={
                  answered && isAnswer
                    ? "justify-start border-correct font-semibold text-correct"
                    : "justify-start"
                }
              >
                {option}
                {answered && isAnswer ? " ✓" : ""}
              </Button>
            );
          })}
        </div>

        <div aria-live="polite" className="min-h-14 text-sm leading-7">
          {answered ? (
            <>
              <p>
                <span className={selected === ANSWER ? "text-correct" : "text-danger"}>
                  {selected === ANSWER ? "درست بود." : "پاسخ درست had است."}
                </span>{" "}
                این جمله شرطی نوع دوم است: if با گذشته‌ی ساده و جواب شرط با would.
              </p>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="font-medium text-link"
              >
                دوباره امتحان کن
              </button>
            </>
          ) : (
            <p className="text-muted">یک گزینه را انتخاب کن تا پاسخ و توضیحش را ببینی.</p>
          )}
        </div>
      </Card.Content>
    </Card>
  );
}

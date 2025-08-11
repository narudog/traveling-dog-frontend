"use client";

import { useState } from "react";
import { useTodayActivityStore } from "@/store/todayActivity";

export default function TodayActivityPage() {
  const {
    recommend,
    save,
    listSaved,
    listSavedByCategory,
    removeSaved,
    countSaved,
    health,
  } = useTodayActivityStore();
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [result, setResult] = useState<any | null>(null);
  const [savedList, setSavedList] = useState<any[]>([]);

  return (
    <div style={{ padding: 16, display: "grid", gap: 12 }}>
      <h1>오늘의 활동</h1>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          placeholder="도시"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <input
          placeholder="카테고리(옵션)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <button
          onClick={async () => {
            const r = await recommend({
              city,
              category: category || undefined,
            });
            setResult(r);
          }}
        >
          추천받기
        </button>
        <button
          onClick={async () => {
            const status = await health();
            alert(status);
          }}
        >
          헬스체크
        </button>
      </div>
      {result && (
        <div style={{ border: "1px solid #eee", padding: 12 }}>
          <div>{result.title}</div>
          <div>{result.description}</div>
          <button
            onClick={async () => {
              await save({ activityId: result.id });
              alert("저장 완료");
            }}
          >
            저장
          </button>
        </div>
      )}

      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={async () => {
            const list = await listSaved();
            setSavedList(list);
          }}
        >
          저장목록 불러오기
        </button>
        <button
          onClick={async () => {
            const list = await listSavedByCategory(category);
            setSavedList(list);
          }}
        >
          카테고리별 목록
        </button>
        <button
          onClick={async () => {
            const c = await countSaved();
            alert(`총 ${c}건 저장됨`);
          }}
        >
          저장개수
        </button>
      </div>

      <ul style={{ padding: 0, listStyle: "none", display: "grid", gap: 8 }}>
        {savedList.map((s) => (
          <li key={s.id} style={{ border: "1px solid #eee", padding: 8 }}>
            <div>{s.title}</div>
            <button onClick={() => removeSaved(s.id)}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

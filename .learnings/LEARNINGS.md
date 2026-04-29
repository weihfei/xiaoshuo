# .learnings/LEARNINGS.md

每日新闻抓取学习日志 - 从RSS新闻中学习知识，持续增长见识

---

## [LRN-20260323-001] 开启每日新闻自主学习

**Logged**: 2026-03-23T09:35:00+08:00
**Priority**: high
**Status**: resolved
**Area**: agent-capability

### Summary
用户要求AI像人类一样每天读报学习，从抓取的新闻中获取知识，持续增长见识，而不仅仅是转发推送。

### Details
- 之前：RSS抓取后只推送给用户，AI本身不学习
- 现在：每天推送完成后，AI自动提取知识存入知识库，持续更新自己的世界观
- 这样在后续对话中，我就能用最新的时事知识回答问题了

### Suggested Action
- 已创建 `.learnings/DAILY-NEWS-KNOWLEDGE.md` 知识库
- 已更新 AGENTS.md 添加每日学习工作流
- 每次推送后自动提取知识，每周归纳到长期记忆

### Metadata
- Source: user_feedback
- Related Files: `AGENTS.md`, `.learnings/DAILY-NEWS-KNOWLEDGE.md`
- Tags: daily-learning, knowledge-growth, self-improvement
- Pattern-Key: daily.news.autonomous.learning

---

## 2026-04-27 RSS AI Reader 火山方舟 API 故障处理

**问题：** RSS AI Reader 的 LLM 摘要全部失败
- 错误：`ModelNotOpen` — 模型 `doubao-seed-1-6-251015` 未对该账户开放
- 根因：火山方舟 Ark API 的模型订阅已过期或账户无权限
- 之前配置：`ep-20250325101015-bbg9f`（已404）+ `doubao-seed-1-6-251015`（ModelNotOpen）

**处理方式：**
1. 手动抓取 IT之家 RSS（`https://www.ithome.com/rss/`）
2. 抓取文章全文
3. 用自身能力生成中文摘要
4. 直接调飞书 webhook 推送
5. 手动写入 `processed_articles` 表去重

**待办（老板需处理）：**
- 登录 https://console.volcengine.com/ark 续费/激活模型
- 或更换为其他 LLM API（如 DeepSeek、Groq 等）
- 修改 `~/rss-reader/my_config.yaml` 的 `openai_model` 为可用模型

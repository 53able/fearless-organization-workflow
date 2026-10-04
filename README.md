<img src="assets/icon.svg" width="64" height="64" alt="">

# The Fearless Organization スキル群

心理的安全性の実践を支える統合スキル1個と専門スキル14個。日本語の手順、判断基準、成果物テンプレートを含みます。スキル本文・参照資料に出典は含めていません。

[統合スキル](skills/fearless-organization-workflow/SKILL.md)から必要な専門スキルを選べます。[振り分け表](skills/fearless-organization-workflow/references/routing.md)に全14個の用途を記載しています。専門スキルは単独でも使えます。

## 導入

GitHubからCodexへ導入できます。

```sh
npx skills add 53able/fearless-organization-workflow --skill '*' --agent codex --yes
```

Vercel の `skills` CLI が検出する `skills/<name>/SKILL.md` 構成です。リポジトリのルートから一覧確認とCodexへの導入ができます。

```sh
npx skills add . --list
npx skills add . --skill '*' --agent codex --yes
```

後者はプロジェクト単位の導入です。グローバル導入は `--global` を追加します。別のプロジェクトから導入する場合は `.` をこのリポジトリのパスに置き換えます。相互参照を使う場合は15個をまとめて導入してください。一部だけを導入した場合も専門スキルは単独で使えますが、未導入の担当先は確認が必要です。

ローカル開発用に、このリポジトリへ直接リンクする方法もあります。

```sh
node scripts/install-suite.mjs
```

`$CODEX_HOME/skills`（未設定なら `~/.codex/skills`）へ各スキルのシンボリックリンクを作成します。既存の同名スキルを上書きしません。別の導入先は第1引数で指定できます。リンク元のこのリポジトリを維持してください。コピーして配布する場合は `skills/` 内の15フォルダを一緒に配置すると相互参照も使えます。

導入後は新しいCodexセッションで `$fearless-organization-workflow` または専門スキル名を指定します。通常の自動選択も有効です。

## 検証

```sh
node scripts/validate-suite.mjs
node tests/install-suite.test.mjs
```

構造、相互参照、UIの呼出し、共通引継ぎ項目、76件のシナリオ定義を検査します。`tests/scenarios.json` の70件と `tests/router-scenarios.json` の6件は振る舞い評価用で、構造検査が全ケースのエージェント実行を意味するわけではありません。実行テストの結果と範囲は [検証記録](tests/validation.md) を参照してください。

尺度の原仕様が不明な場合の採点、法務・労務・専門安全判断、制度の決裁は保留または権限者へ引き継ぎます。心理的安全性や改善効果を保証するものではありません。

## ライセンス

[MIT License](LICENSE)。各スキルにもライセンス本文を同梱しています。

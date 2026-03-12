# Phase 2: Holiday Data & API Integration - Context

**Gathered:** 2026-03-12
**Status:** Ready for planning

<domain>
## Phase Boundary

Integrar feriados nacionais via Nager.Date API e feriados municipais via dados locais no calendário existente. Inclui: composable de gestão de feriados, seletor de município, visual styling dos dias com feriado, e tooltips informativos. Interatividade de férias e dashboard são fases separadas.

</domain>

<decisions>
## Implementation Decisions

### Estratégia de Fetch da API
- Fetch ao mount da app e reactivamente ao mudar o ano (via configStore.year)
- Durante loading: mostrar calendário sem feriados (não bloquear render)
- Fallback se API falhar: usar holiday-utils.ts local (já calcula Páscoa, Carnaval, Ascensão, Pentecostes, Corpus Christi, Sexta-feira Santa, Segunda-feira de Páscoa)
- Dados a usar da API: `date` + `localName` (já vem em Português)

### Arquitetura do Composable
- Criar `useHolidays()` composable que encapsula: fetch da API, estado de loading, erro, fallback local, e combinação com feriados municipais
- `useHolidays()` recebe o município selecionado e devolve um mapa único de todos os feriados do ano
- Mantém `useCalendar.ts` limpo (sem lógica de fetch)

### Seletor de Município
- Combobox com pesquisa por texto livre (filtra ao escrever)
- Localização: no header/topo da página, junto ao título
- Comportamento: atualizar calendário imediatamente ao selecionar (reactivo via configStore.selectedMunicipalityId)
- Por padrão: nenhum município selecionado (só feriados nacionais) — município é opcional

### Visual dos Feriados no DayCell
- Feriados nacionais: `bg-red-100 text-red-700` (vermelho claro)
- Feriados municipais: `bg-orange-100 text-orange-700` (âmbar/laranja)
- Fins-de-semana: `bg-pink-50 text-pink-600` (já existente)
- Prioridade quando acumula: feriado > fim-de-semana (feriado sobrepõe estilo de fim-de-semana)

### Tooltips
- Mostrar tooltip em feriados: nome do feriado + tipo (ex: "Dia de Portugal · Feriado Nacional" ou "São João · Feriado Municipal (Porto)")
- Implementação: atributo HTML `title` nativo no DayCell — zero dependências
- Fins-de-semana sem feriado: sem tooltip

### Claude's Discretion
- Lógica exacta de mapeamento do município selecionado ao seu feriado municipal
- Formato exacto do texto no title tooltip
- Handling de estados de loading na UI (sem spinner, mas sem crashar)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/utils/holiday-utils.ts`: Algoritmos para feriados móveis (Páscoa, Carnaval, Ascensão, Pentecostes, Corpus Christi, Sexta-feira Santa, Segunda-feira de Páscoa) — usar como fallback quando Nager.Date API falha
- `src/store/config.ts`: Pinia store com `year` e `selectedMunicipalityId` — useHolidays() deve ser reactivo a estes valores
- `src/data/municipalities.json`: 308 municípios com campos `id`, `name`, `district`, `holiday` — já disponível, não precisa de fetch
- `src/types/holiday.ts`: Tipos `HolidayType`, `Holiday`, `Municipality`, `CalendarDay` já definidos — usar e estender se necessário
- `src/composables/useCalendar.ts`: Interface `Day` com `date`, `dayOfMonth`, `isWeekend` — será necessário estender com `isHoliday`, `holidayName`, `holidayType`

### Established Patterns
- Composables em `src/composables/` — criar `useHolidays.ts` aqui
- Pinia stores em `src/store/` — configStore já usado nos componentes
- Tailwind CSS classes para styling — manter convenção de classes utilitárias inline

### Integration Points
- `DayCell.vue`: Receber props adicionais (`isHoliday`, `holidayName`, `holidayType`) ou um objeto `CalendarDay` completo
- `YearGrid.vue` ou `MonthCard.vue`: Ponto onde useHolidays() será chamado e os dados passados para baixo
- `App.vue`: Onde o seletor de município e header serão adicionados

</code_context>

<specifics>
## Specific Ideas

- Referência visual: Calendarr Portugal usa vermelho para feriados — alinhar com essa convenção
- A pesquisa do combobox de município deve funcionar com nomes parciais ("Lis" → "Lisboa")

</specifics>

<deferred>
## Deferred Ideas

- Nenhuma — a discussão manteve-se dentro do escopo da Fase 2

</deferred>

---

*Phase: 02-holiday-data-api-integration-week-1*
*Context gathered: 2026-03-12*

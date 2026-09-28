import { FormEvent, useMemo, useState } from 'react'
import { useGameStore } from '../store/useGameStore'

const koreanNameRegex = /^[가-힣]{1,8}$/

export function NameSetupPage() {
  const setPlayerName = useGameStore((state) => state.setPlayerName)
  const [name, setName] = useState('')
  const [touched, setTouched] = useState(false)

  const isValid = useMemo(() => koreanNameRegex.test(name.trim()), [name])

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setTouched(true)
    if (!isValid) return
    setPlayerName(name.trim())
  }

  return (
    <div className="page name-page">
      <div className="name-intro">
        <p className="eyebrow">NEW DIARY</p>
        <h1>당신의 이름은?</h1>
        <p className="lead">
          새로운 영감을 찾아 걷는 인형 디자이너의 하루가 시작됩니다.
        </p>
      </div>

      <form className="name-form" onSubmit={submit}>
        <label htmlFor="player-name">이름</label>
        <input
          id="player-name"
          value={name}
          onChange={(event) => {
            setName(event.target.value.slice(0, 8))
            setTouched(true)
          }}
          placeholder="예: 유진"
          autoComplete="off"
          inputMode="text"
          aria-describedby="name-help"
        />
        <p id="name-help" className={`helper${touched && !isValid ? ' is-error' : ''}`}>
          {touched && !isValid ? '한글 이름을 1~8자로 입력해주세요.' : '게임 속 인물들이 이 이름으로 당신을 부릅니다.'}
        </p>
        <button className="primary-button" type="submit" disabled={!isValid}>
          이 이름으로 시작하기
        </button>
      </form>

      <p className="tiny-note">이름은 이후 설정에서 변경할 수 있도록 추가할 예정입니다.</p>
    </div>
  )
}

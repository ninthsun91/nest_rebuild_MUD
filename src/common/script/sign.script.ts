export const signScript = {
    in: `\n======================로그인==========================\n`,
    up: `\n======================회원가입==========================\n`,
    username: `아이디: \n`,
    password: `비밀번호: \n`,
    character: `플레이할 캐릭터의 이름을 입력해주세요: \n`,

    incorrect: `아이디 혹은 비밀번호가 일치하지 않습니다.\n
    이미 아이디가 있다면 <span style="color:yellow">[IN]</span>을,
    회원가입을 해야한다면 <span style="color:yellow">[UP]</span>을 입력해주세요. \n`,
    dupUser: `이미 존재하는 아이디입니다.
    사용하실 아이디를 입력해주세요: \n`,
    dupName: `이미 존재하는 이름입니다.
    플레이할 캐릭터의 이름을 입력해주세요: \n`,
    invalidID: `아이디는 영문+숫자 조합으로 4~16자의 길이를 가져야 합니다.\n`,
    invalidPW: `비밀번호는 영문,숫자가 최소 1개씩 사용된 조합으로,
    6~12자의 길이를 가져야 합니다.\n`,
    invalidName: `캐릭터의 이름은 한글과 영문를 동반하여 사용할 수 없으며,
    한글+숫자 : 2~10자의 길이를 가져야 합니다.
    영문+숫자 : 4~16자의 길이를 가져야 합니다.\n`,

    inComplete: `\n로그인 완료!!\n\n
    던전으로 가려면 <span style="color:yellow">[D]ungeon</span>을,
    마을로 가려면 <span style="color:yellow">[V]illage</span>를,
    접속을 종료하려면 <span style="color:yellow">[OUT]</span>을 입력해주세요.\n`,
    upComplete: `\n\n 캐릭터 생성 완료!\n.
    던전으로 가려면 <span style="color:yellow">[D]ungeon</span>을,
    마을로 가려면 <span style="color:yellow">[V]illage</span>를,
    접속을 종료하려면 <span style="color:yellow">[OUT]</span>을 입력해주세요.\n`,
};
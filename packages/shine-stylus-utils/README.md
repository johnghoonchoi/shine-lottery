이 패키지는 `mquandalle:meteor-jeet`(https://github.com/mquandalle/meteor-jeet)에서 Forked 되었습니다.

###설치하기

$ meteor add keycode:stylus-utils

###사용법

이 패키지는 Meteor v1.2에서 소개된 CSS pre-processors(여기서는 Stylus)를 처리하기 위한 새로운 API를 사용합니다.
1.2 이전 버전의 Meteor 앱에서는 제대로 작동하지 않을 것입니다. 
일단 이 패키지가 설치되면, stylus stylesheet 안에 다음 import문을 사용해서 Stylus에서 필요한 라이브러리를 가져옵니다.

```
@import 'nib'
@import '{keycode:stylus-utils}/jeet'
@import '{keycode:stylus-utils}/rupture'
@import '{keycode:stylus-utils}/axis'
@import '{keycode:stylus-utils}/typographic'
```
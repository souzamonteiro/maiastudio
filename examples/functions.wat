(module 
(func $f6(export "f6") (param $a i32) (param $b i32) (result i32)
    (i32.add
      (local.get $a)
      (local.get $b)
    )

)
(func $f7(export "f7") (param $a i32) (param $b i32) (result i32)
    (i32.mul
      (local.get $a)
      (local.get $b)
    )

)
)
/**
 * Created by imrlab on 2014. 7. 29..
 * Written by rehomik
 */

$('#pad1, #pad2, #pad3, #pad4, #pad5, #pad6, #pad7, #pad8, #pad9').each(function addClick() {

  $(this).click(function onClick() {

    alert($(this).text());

  });
});
import { deleteSync } from 'del'
import gulp from 'gulp'
import dartSass from 'sass'
import gulpSass from 'gulp-sass'
import browserSync from 'browser-sync'
import useref from 'gulp-useref'
import uglify from 'gulp-uglify'
import gulpIf from 'gulp-if'
import minifyCSS from 'gulp-minify-css'
import imagemin from 'gulp-imagemin'
import cache from 'gulp-cache'
const sass = gulpSass(dartSass)

//Компиляция SASS/SCSS в CSS
gulp.task('sass', function(){
	return gulp.src('app/scss/**/*.+(scss|sass)')
	.pipe(sass())
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({
		stream: true
	}))
})

//Запуск сервера
gulp.task('browserSync', function(){
	browserSync.init({
		server: 'app'
	})
})

//Запуск сервера + его обновление при изменении данных в файлах .js/.html/(.scss/.sass)
gulp.task('watch', gulp.series('sass', function(){
	browserSync.init({
		server: 'app'
	})
	gulp.watch('app/scss/**/*.+(sass|scss)', gulp.series('sass'))
	gulp.watch('app/**/*.html').on('change', browserSync.reload)
	gulp.watch('app/js/**/*.js').on('change', browserSync.reload)
}))

//Оптимизация файлов: .js .css .html
gulp.task('minify', function(){
	return gulp.src('app/*.html')
	.pipe(useref())
	.pipe(gulpIf('*.css', minifyCSS()))
	.pipe(gulpIf('*.js', uglify()))
	.pipe(gulp.dest('dist'))
});

//Оптимизация изображений формата: .png .jpg .jpeg .gif .svg
gulp.task('images', function(){
	return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
	.pipe(cache(imagemin()))
	.pipe(gulp.dest('dist/images'))
})

//Перенос шрифтов в основную папку
gulp.task('fonts', function(){
	return gulp.src('app/fonts/**/*')
	.pipe(gulp.dest('dist/fonts'))
})

//Выборочная очистка файлов финальной папки
gulp.task('clean', async function(){
	deleteSync('dist/**/*', '!dist/images', '!dist/images/**/*')
})

//Полная очистка файлов финальной папки
gulp.task('del', function(){
	deleteSync('dist');
	return cache.clearAll();
})

//Build
gulp.task('build', gulp.series('clean', 'sass', 'minify', 'images', 'fonts'))






// var gulp = require('gulp');
// var sass = require('gulp-sass')(require('sass'));
// var browserSync = require('browser-sync');
// var useref = require('gulp-useref');
// var uglify = require('gulp-uglify');
// var minifyCSS = require('gulp-minify-css');
// var gulpIf = require('gulp-if');
// var imagemin = require('gulp-imagemin');
// var cache = require('gulp-cache');
// // var del = require('del');
// gulp.task('sayHello', function(){
// 	console.log("Hello World, it's gulp")
// });
// gulp.task('sass', function(){
// 	return gulp.src('app/scss/**/*.+(scss|sass)')
// 		.pipe(sass())
// 		.pipe(gulp.dest('app/css'))
// 		.pipe(browserSync.reload({
// 			stream: true
// 		}))

// });
// gulp.task('browserSync', function(){
// 	browserSync({
// 		server: {
// 			baseDir: 'app'
// 		}
// 	})
// })
// gulp.task('watch', gulp.parallel('sass', 'browserSync', function(){
// 	gulp.watch('app/scss/**/*.+(scss|sass)', gulp.series('sass'));
// 	gulp.watch('app/*.html', browserSync.reload)
// 	gulp.watch('app/**/*.js', browserSync.reload)
// }))
// gulp.task('minify', function(){
// 	return gulp.src('app/*.html')
// 	.pipe(useref())
// 	.pipe(gulpIf('*.css', minifyCSS()))
// 	.pipe(gulpIf('*.js', uglify()))
// 	.pipe(gulp.dest('dist'))
// });
// gulp.task('images', function(){
// 	return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
// 	.pipe(cache(imagemin()))
// 	.pipe(gulp.dest('dist/images'))
// })
// gulp.task('fonts', function(){
// 	return gulp.src('app/fonts/**/*')
// 	.pipe(gulp.dest('dist/fonts'))
// })
// gulp.task('clean', function(){
// 	del(['dist/**/*', '!dist/images', '!dist/images/**/*'], callback)
// })
// gulp.task('del', function(){
// 	del('dist');
// 	return cache.clearAll(callback);
// })
// gulp.task('build', gulp.series('clean', 'sass', 'minify', 'images', 'fonts'))
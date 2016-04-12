//
//  SBSConstraints.h
//  ionic-4.13
//
//  Created by Moritz Hartmeier on 11/04/16.
//
//

#import <Foundation/Foundation.h>

@interface SBSConstraints : NSObject

@property (nonatomic, strong) NSNumber *leftMargin;
@property (nonatomic, strong) NSNumber *topMargin;
@property (nonatomic, strong) NSNumber *rightMargin;
@property (nonatomic, strong) NSNumber *bottomMargin;
@property (nonatomic, strong) NSNumber *width;
@property (nonatomic, strong) NSNumber *height;

- (instancetype)initWithMargins:(CGRect)margins;

@end
